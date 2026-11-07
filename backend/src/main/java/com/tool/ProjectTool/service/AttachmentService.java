package com.tool.ProjectTool.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.TaskAttachment;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.DataNotFoundException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.messaging.FileCleanupMessage;
import com.tool.ProjectTool.messaging.JobPublisher;
import com.tool.ProjectTool.messaging.MessagingConfig;
import com.tool.ProjectTool.model.response.AttachmentResponse;
import com.tool.ProjectTool.repo.BacklogRepository;
import com.tool.ProjectTool.repo.ProjectTaskRepository;
import com.tool.ProjectTool.repo.TaskAttachmentRepository;

// Images attached to tasks: PNG, JPG, GIF or WebP, up to MAX_SIZE each and MAX_PER_TASK per task.
// Only the person who attached an image, or the project lead, may delete it.
@Service
public class AttachmentService {

	public static final long MAX_SIZE = 5L * 1024 * 1024;
	public static final int MAX_PER_TASK = 10;
	private static final int MAX_NAME_LENGTH = 120;

	private static final Logger log = LoggerFactory.getLogger(AttachmentService.class);

	@Autowired
	private TaskAttachmentRepository attachmentRepo;

	@Autowired
	private ProjectTaskRepository projectTaskRepo;

	@Autowired
	private BacklogRepository backlogRepo;

	@Autowired
	private AttachmentStorage storage;

	@Autowired
	private ActivityService activityService;

	@Autowired
	private JobPublisher publisher;

	// The image types we take, told apart by their first bytes rather than what the browser claims
	enum ImageType {
		PNG("image/png", "png"), JPEG("image/jpeg", "jpg", "jpeg"), GIF("image/gif", "gif"), WEBP("image/webp", "webp");

		final String contentType;
		// The first is the one we use
		final List<String> extensions;
		final String extension;

		ImageType(String contentType, String... extensions) {
			this.contentType = contentType;
			this.extensions = List.of(extensions);
			this.extension = extensions[0];
		}

		static ImageType detect(byte[] bytes) {
			if (startsWith(bytes, 0, 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A)) {
				return PNG;
			}
			if (startsWith(bytes, 0, 0xFF, 0xD8, 0xFF)) {
				return JPEG;
			}
			if (startsWith(bytes, 0, 'G', 'I', 'F', '8')) {
				return GIF;
			}
			if (startsWith(bytes, 0, 'R', 'I', 'F', 'F') && startsWith(bytes, 8, 'W', 'E', 'B', 'P')) {
				return WEBP;
			}
			return null;
		}

		private static boolean startsWith(byte[] bytes, int offset, int... expected) {
			if (bytes.length < offset + expected.length) {
				return false;
			}
			for (int i = 0; i < expected.length; i++) {
				if ((bytes[offset + i] & 0xFF) != expected[i]) {
					return false;
				}
			}
			return true;
		}
	}

	private record Checked(MultipartFile file, byte[] bytes, ImageType type) {
	}

	public List<AttachmentResponse> getAttachments(String taskSequence) {
		ProjectTask task = findTask(taskSequence);
		Users me = currentUser();
		String leadId = leadId(task);

		List<AttachmentResponse> responses = new ArrayList<>();
		for (TaskAttachment attachment : attachmentRepo.findByTaskSequenceOrderByCreatedAtAsc(taskSequence)) {
			responses.add(toResponse(attachment, me, leadId));
		}
		return responses;
	}

	// Every file is checked before any is stored, so a bad one leaves the task as it was
	@Transactional
	public String upload(String taskSequence, List<MultipartFile> files) {
		ProjectTask task = findTask(taskSequence);
		if (files == null || files.isEmpty()) {
			throw new BadRequestException("Choose an image to attach");
		}
		if (attachmentRepo.countByTaskSequence(taskSequence) + files.size() > MAX_PER_TASK) {
			throw new BadRequestException("A task can have at most " + MAX_PER_TASK + " images");
		}

		List<Checked> checked = new ArrayList<>();
		for (MultipartFile file : files) {
			if (file.getSize() > MAX_SIZE) {
				throw new BadRequestException("Each image can be at most 5 MB");
			}
			byte[] bytes;
			try {
				bytes = file.getBytes();
			} catch (IOException e) {
				throw new BadRequestException("Couldn't read the image. Please try again.");
			}
			ImageType type = ImageType.detect(bytes);
			if (type == null) {
				throw new BadRequestException("Only PNG, JPG, GIF and WebP images can be attached");
			}
			checked.add(new Checked(file, bytes, type));
		}

		Users me = currentUser();
		List<String> stored = new ArrayList<>();
		// If saving the rows fails, the files written for them go too
		afterRollback(() -> stored.forEach(this::deleteQuietly));

		for (Checked item : checked) {
			String storedName = UUID.randomUUID() + "." + item.type().extension;
			storage.save(storedName, item.bytes());
			stored.add(storedName);

			TaskAttachment attachment = new TaskAttachment();
			attachment.setAttachmentId(UUID.randomUUID().toString());
			attachment.setTaskSequence(task.getProjectSequence());
			attachment.setProjectIdentifier(task.getProjectIdentifier());
			attachment.setFileName(cleanFileName(item.file().getOriginalFilename(), item.type()));
			attachment.setContentType(item.type().contentType);
			attachment.setSize(item.bytes().length);
			attachment.setStoredName(storedName);
			if (me != null) {
				attachment.setUploadedBy(me.getUserId());
				attachment.setUploadedByName(me.getName());
			}
			attachmentRepo.save(attachment);
			activityService.recordTaskActivity(ActivityType.ATTACHMENT_ADDED, task, null, attachment.getFileName());
		}

		return checked.size() == 1 ? "Image attached" : checked.size() + " images attached";
	}

	public TaskAttachment getAttachment(String attachmentId) {
		TaskAttachment attachment = attachmentRepo.findByAttachmentId(attachmentId);
		if (attachment == null) {
			throw new DataNotFoundException("Attachment not found");
		}
		return attachment;
	}

	public Resource getContent(TaskAttachment attachment) {
		Resource content = storage.load(attachment.getStoredName());
		if (!content.exists()) {
			throw new DataNotFoundException("Attachment not found");
		}
		return content;
	}

	@Transactional
	public String delete(String attachmentId) {
		TaskAttachment attachment = getAttachment(attachmentId);
		ProjectTask task = findTask(attachment.getTaskSequence());
		if (!canDelete(attachment, currentUser(), leadId(task))) {
			throw new BadRequestException("Only the person who attached it or the project lead can delete this image");
		}

		attachmentRepo.delete(attachment);
		activityService.recordTaskActivity(ActivityType.ATTACHMENT_REMOVED, task, attachment.getFileName(), null);
		// The file clean-up queue removes the file once the row is really gone
		publisher.publish(MessagingConfig.FILE_CLEANUP_ROUTING_KEY, new FileCleanupMessage(attachment.getStoredName()));
		return "Image deleted";
	}

	private AttachmentResponse toResponse(TaskAttachment attachment, Users me, String leadId) {
		AttachmentResponse response = new AttachmentResponse();
		response.setAttachmentId(attachment.getAttachmentId());
		response.setFileName(attachment.getFileName());
		response.setContentType(attachment.getContentType());
		response.setSize(attachment.getSize());
		response.setUploadedByName(attachment.getUploadedByName());
		response.setCreatedOn(attachment.getCreatedAt());
		response.setCanDelete(canDelete(attachment, me, leadId));
		return response;
	}

	private boolean canDelete(TaskAttachment attachment, Users me, String leadId) {
		if (me == null || me.getUserId() == null) {
			return false;
		}
		return me.getUserId().equals(attachment.getUploadedBy()) || me.getUserId().equals(leadId);
	}

	// The lead is the user who owns the project
	private String leadId(ProjectTask task) {
		Backlog backlog = backlogRepo.findByProjectIdentifier(task.getProjectIdentifier());
		if (backlog == null || backlog.getProject() == null || backlog.getProject().getUser() == null) {
			return null;
		}
		return backlog.getProject().getUser().getUserId();
	}

	private ProjectTask findTask(String taskSequence) {
		ProjectTask task = projectTaskRepo.findByProjectSequence(taskSequence);
		if (task == null) {
			throw new TaskIdNotFoundException("Task id not found");
		}
		return task;
	}

	// The person comes from the login, never from the request
	private Users currentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null && auth.getPrincipal() instanceof Users user ? user : null;
	}

	// Without any folders, and with the right extension for what the file really is
	static String cleanFileName(String original, ImageType type) {
		String name = original == null ? "" : original;
		name = name.substring(Math.max(name.lastIndexOf('/'), name.lastIndexOf('\\')) + 1);
		name = name.replaceAll("[\\p{Cntrl}]", "").trim();

		int dot = name.lastIndexOf('.');
		String base = dot > 0 ? name.substring(0, dot) : name;
		String extension = dot > 0 ? name.substring(dot + 1).toLowerCase(Locale.ROOT) : "";
		String suffix = "." + (type.extensions.contains(extension) ? extension : type.extension);

		if (base.isBlank()) {
			base = "image";
		}
		int room = MAX_NAME_LENGTH - suffix.length();
		if (base.length() > room) {
			base = base.substring(0, room).trim();
		}
		return base + suffix;
	}

	// Best effort: the upload is failing anyway, and a file left behind only takes space
	private void deleteQuietly(String storedName) {
		try {
			storage.delete(storedName);
		} catch (RuntimeException e) {
			log.warn("Couldn't delete image file {} after a failed upload", storedName, e);
		}
	}

	private void afterRollback(Runnable action) {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCompletion(int status) {
					if (status == STATUS_ROLLED_BACK) {
						action.run();
					}
				}
			});
		}
	}
}
