package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.TaskAttachment;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.DataNotFoundException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.response.AttachmentResponse;
import com.tool.ProjectTool.repo.BacklogRepository;
import com.tool.ProjectTool.repo.ProjectTaskRepository;
import com.tool.ProjectTool.repo.TaskAttachmentRepository;

@ExtendWith(MockitoExtension.class)
class AttachmentServiceTest {

	@Mock
	private TaskAttachmentRepository attachmentRepo;

	@Mock
	private ProjectTaskRepository projectTaskRepo;

	@Mock
	private BacklogRepository backlogRepo;

	@Mock
	private AttachmentStorage storage;

	@Mock
	private ActivityService activityService;

	@InjectMocks
	private AttachmentService service;

	private static final byte[] PNG = { (byte) 0x89, 'P', 'N', 'G', 0x0D, 0x0A, 0x1A, 0x0A, 0, 0 };
	private static final byte[] JPEG = { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, 0 };
	private static final byte[] GIF = { 'G', 'I', 'F', '8', '9', 'a' };
	private static final byte[] WEBP = { 'R', 'I', 'F', 'F', 0, 0, 0, 0, 'W', 'E', 'B', 'P' };

	@AfterEach
	void logOut() {
		SecurityContextHolder.clearContext();
	}

	private Users user(String id, String name) {
		Users user = new Users();
		user.setUserId(id);
		user.setName(name);
		return user;
	}

	private void loggedInAs(Users user) {
		SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(user, null, List.of()));
	}

	private ProjectTask task() {
		ProjectTask task = new ProjectTask();
		task.setProjectSequence("AB-1");
		task.setProjectIdentifier("AB");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(task);
		return task;
	}

	private void ledBy(Users lead) {
		ProjectEntity project = new ProjectEntity();
		project.setUser(lead);
		Backlog backlog = new Backlog();
		backlog.setProject(project);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);
	}

	private MultipartFile file(String name, byte[] content) {
		return new MockMultipartFile("files", name, "image/png", content);
	}

	private TaskAttachment attachment(String uploadedBy) {
		TaskAttachment attachment = new TaskAttachment();
		attachment.setAttachmentId("att-1");
		attachment.setTaskSequence("AB-1");
		attachment.setFileName("shot.png");
		attachment.setStoredName("stored.png");
		attachment.setUploadedBy(uploadedBy);
		when(attachmentRepo.findByAttachmentId("att-1")).thenReturn(attachment);
		return attachment;
	}

	@Test
	void aValidImageIsStoredUnderOurOwnNameAndRecorded() {
		ProjectTask task = task();
		loggedInAs(user("user-1", "Asha"));

		assertEquals("Image attached", service.upload("AB-1", List.of(file("shot.png", PNG))));

		ArgumentCaptor<TaskAttachment> saved = ArgumentCaptor.forClass(TaskAttachment.class);
		verify(attachmentRepo).save(saved.capture());
		TaskAttachment attachment = saved.getValue();
		assertEquals("shot.png", attachment.getFileName());
		assertEquals("image/png", attachment.getContentType());
		assertEquals(PNG.length, attachment.getSize());
		assertEquals("user-1", attachment.getUploadedBy());
		assertEquals("Asha", attachment.getUploadedByName());
		assertTrue(attachment.getStoredName().matches("[0-9a-f-]{36}\\.png"), attachment.getStoredName());
		verify(storage).save(attachment.getStoredName(), PNG);
		verify(activityService).recordTaskActivity(eq(ActivityType.ATTACHMENT_ADDED), eq(task), isNull(), eq("shot.png"));
	}

	@Test
	void theTypeComesFromTheBytesNotTheNameOrTheBrowser() {
		task();

		assertEquals("4 images attached",
				service.upload("AB-1", List.of(file("photo.png", JPEG), file("a.gif", GIF), file("b", WEBP), file("c.JPEG", JPEG))));

		ArgumentCaptor<TaskAttachment> saved = ArgumentCaptor.forClass(TaskAttachment.class);
		verify(attachmentRepo, times(4)).save(saved.capture());
		List<String> names = saved.getAllValues().stream().map((a) -> a.getFileName() + " " + a.getContentType()).toList();
		assertEquals(List.of("photo.jpg image/jpeg", "a.gif image/gif", "b.webp image/webp", "c.jpeg image/jpeg"), names);
	}

	@Test
	void anythingButTheFourImageTypesIsRefusedAndNothingIsStored() {
		task();
		byte[] svg = "<svg xmlns=\"http://www.w3.org/2000/svg\"/>".getBytes();

		BadRequestException error = assertThrows(BadRequestException.class,
				() -> service.upload("AB-1", List.of(file("ok.png", PNG), file("evil.png", svg))));

		assertEquals("Only PNG, JPG, GIF and WebP images can be attached", error.getMessage());
		verify(storage, never()).save(anyString(), any());
		verify(attachmentRepo, never()).save(any());
	}

	@Test
	void imagesOverFiveMegabytesAreRefused() {
		task();
		byte[] big = Arrays.copyOf(PNG, (int) AttachmentService.MAX_SIZE + 1);

		BadRequestException error = assertThrows(BadRequestException.class, () -> service.upload("AB-1", List.of(file("big.png", big))));

		assertEquals("Each image can be at most 5 MB", error.getMessage());
		verify(storage, never()).save(anyString(), any());
	}

	@Test
	void aTaskTakesAtMostTenImages() {
		task();
		when(attachmentRepo.countByTaskSequence("AB-1")).thenReturn(9L);

		BadRequestException error = assertThrows(BadRequestException.class,
				() -> service.upload("AB-1", List.of(file("a.png", PNG), file("b.png", PNG))));

		assertEquals("A task can have at most 10 images", error.getMessage());
		verify(storage, never()).save(anyString(), any());
	}

	@Test
	void uploadingNothingOrToAnUnknownTaskFails() {
		task();
		BadRequestException empty = assertThrows(BadRequestException.class, () -> service.upload("AB-1", List.of()));
		assertEquals("Choose an image to attach", empty.getMessage());

		assertThrows(TaskIdNotFoundException.class, () -> service.upload("AB-9", List.of(file("a.png", PNG))));
	}

	@Test
	void theUploaderCanDeleteAndTheFileGoesWithIt() {
		ProjectTask task = task();
		ledBy(user("lead", "Lena"));
		TaskAttachment attachment = attachment("user-1");
		loggedInAs(user("user-1", "Asha"));

		assertEquals("Image deleted", service.delete("att-1"));

		verify(attachmentRepo).delete(attachment);
		verify(storage).delete("stored.png");
		verify(activityService).recordTaskActivity(eq(ActivityType.ATTACHMENT_REMOVED), eq(task), eq("shot.png"), isNull());
	}

	@Test
	void theLeadCanDeleteAnyonesImage() {
		task();
		ledBy(user("lead", "Lena"));
		TaskAttachment attachment = attachment("user-1");
		loggedInAs(user("lead", "Lena"));

		service.delete("att-1");

		verify(attachmentRepo).delete(attachment);
	}

	@Test
	void someoneElseCannotDelete() {
		task();
		ledBy(user("lead", "Lena"));
		attachment("user-1");
		loggedInAs(user("user-2", "Ravi"));

		BadRequestException error = assertThrows(BadRequestException.class, () -> service.delete("att-1"));

		assertEquals("Only the person who attached it or the project lead can delete this image", error.getMessage());
		verify(attachmentRepo, never()).delete(any());
		verify(storage, never()).delete(anyString());
	}

	@Test
	void theListSaysWhoMayDelete() {
		task();
		ledBy(user("lead", "Lena"));
		TaskAttachment mine = new TaskAttachment();
		mine.setAttachmentId("a");
		mine.setUploadedBy("user-1");
		TaskAttachment theirs = new TaskAttachment();
		theirs.setAttachmentId("b");
		theirs.setUploadedBy("user-2");
		when(attachmentRepo.findByTaskSequenceOrderByCreatedAtAsc("AB-1")).thenReturn(List.of(mine, theirs));
		loggedInAs(user("user-1", "Asha"));

		List<AttachmentResponse> list = service.getAttachments("AB-1");

		assertTrue(list.get(0).isCanDelete());
		assertFalse(list.get(1).isCanDelete());
	}

	@Test
	void anUnknownAttachmentIsNotFound() {
		assertThrows(DataNotFoundException.class, () -> service.getAttachment("nope"));
	}

	@Test
	void fileNamesLoseTheirFoldersAndGetTheRightExtension() {
		assertEquals("passwd.png", AttachmentService.cleanFileName("../../etc/passwd", AttachmentService.ImageType.PNG));
		assertEquals("a.jpeg", AttachmentService.cleanFileName("C:\\Users\\x\\a.JPEG", AttachmentService.ImageType.JPEG));
		assertEquals("image.png", AttachmentService.cleanFileName("", AttachmentService.ImageType.PNG));
		assertEquals("image.gif", AttachmentService.cleanFileName(null, AttachmentService.ImageType.GIF));
		String longName = AttachmentService.cleanFileName("x".repeat(300) + ".webp", AttachmentService.ImageType.WEBP);
		assertEquals(120, longName.length());
		assertTrue(longName.endsWith(".webp"));
	}
}
