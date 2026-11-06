package com.tool.ProjectTool.controller;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tool.ProjectTool.entity.TaskAttachment;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.AttachmentResponse;
import com.tool.ProjectTool.service.AttachmentService;

// Task images. Like every other route here they need a login; the images are never served as public files.
@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class AttachmentController {

	@Autowired
	private AttachmentService attachmentService;

	@GetMapping("/getAttachments/{taskId}")
	public ResponseEntity<ApiResponse<List<AttachmentResponse>>> getAttachments(@PathVariable("taskId") String taskId) {
		return ApiResponseBuilder.ok(attachmentService.getAttachments(taskId));
	}

	@PostMapping(path = "/uploadAttachments/{taskId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<ApiResponse<Void>> uploadAttachments(@PathVariable("taskId") String taskId,
			@RequestParam(name = "files", required = false) List<MultipartFile> files) {
		return ApiResponseBuilder.created(attachmentService.upload(taskId, files));
	}

	// An attachment never changes, so the browser may keep it; nosniff stops it being read as anything but an image
	@GetMapping("/attachment/{attachmentId}")
	public ResponseEntity<Resource> getAttachmentContent(@PathVariable("attachmentId") String attachmentId) {
		TaskAttachment attachment = attachmentService.getAttachment(attachmentId);
		Resource content = attachmentService.getContent(attachment);

		return ResponseEntity.ok()
				.contentType(MediaType.parseMediaType(attachment.getContentType()))
				.contentLength(attachment.getSize())
				.cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS).cachePrivate().immutable())
				.header(HttpHeaders.CONTENT_DISPOSITION,
						ContentDisposition.inline().filename(attachment.getFileName(), StandardCharsets.UTF_8).build().toString())
				.header("X-Content-Type-Options", "nosniff")
				.header("Content-Security-Policy", "default-src 'none'; sandbox")
				.body(content);
	}

	@PostMapping("/deleteAttachment/{attachmentId}")
	public ResponseEntity<ApiResponse<Void>> deleteAttachment(@PathVariable("attachmentId") String attachmentId) {
		return ApiResponseBuilder.ok(attachmentService.delete(attachmentId));
	}
}
