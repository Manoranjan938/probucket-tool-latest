package com.tool.ProjectTool.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

// An image attached to a task. The file itself is on disk under storedName; fileName is only for showing.
@Entity
@Table(name = "task_attachment", indexes = @Index(name = "idx_task_attachment_task", columnList = "taskSequence"))
public class TaskAttachment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Random, so attachments can't be guessed by counting
	@Column(nullable = false, unique = true, updatable = false, length = 36)
	private String attachmentId;

	@Column(nullable = false, updatable = false)
	private String taskSequence;

	@Column(nullable = false, updatable = false)
	private String projectIdentifier;

	@Column(nullable = false)
	private String fileName;

	@Column(nullable = false)
	private String contentType;

	private long size;

	// A random name of our own; the user's file name never becomes a path
	@Column(nullable = false, updatable = false)
	private String storedName;

	// User id and name of the person who attached it
	private String uploadedBy;

	private String uploadedByName;

	private Date createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getAttachmentId() {
		return attachmentId;
	}

	public void setAttachmentId(String attachmentId) {
		this.attachmentId = attachmentId;
	}

	public String getTaskSequence() {
		return taskSequence;
	}

	public void setTaskSequence(String taskSequence) {
		this.taskSequence = taskSequence;
	}

	public String getProjectIdentifier() {
		return projectIdentifier;
	}

	public void setProjectIdentifier(String projectIdentifier) {
		this.projectIdentifier = projectIdentifier;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public long getSize() {
		return size;
	}

	public void setSize(long size) {
		this.size = size;
	}

	public String getStoredName() {
		return storedName;
	}

	public void setStoredName(String storedName) {
		this.storedName = storedName;
	}

	public String getUploadedBy() {
		return uploadedBy;
	}

	public void setUploadedBy(String uploadedBy) {
		this.uploadedBy = uploadedBy;
	}

	public String getUploadedByName() {
		return uploadedByName;
	}

	public void setUploadedByName(String uploadedByName) {
		this.uploadedByName = uploadedByName;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

}
