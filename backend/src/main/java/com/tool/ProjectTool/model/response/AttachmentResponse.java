package com.tool.ProjectTool.model.response;

import java.util.Date;

public class AttachmentResponse {

	private String attachmentId;

	private String fileName;

	private String contentType;

	// Bytes
	private long size;

	private String uploadedByName;

	private Date createdOn;

	// Whether the person asking may delete it: the uploader or the project lead
	private boolean canDelete;

	public String getAttachmentId() {
		return attachmentId;
	}

	public void setAttachmentId(String attachmentId) {
		this.attachmentId = attachmentId;
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

	public String getUploadedByName() {
		return uploadedByName;
	}

	public void setUploadedByName(String uploadedByName) {
		this.uploadedByName = uploadedByName;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public boolean isCanDelete() {
		return canDelete;
	}

	public void setCanDelete(boolean canDelete) {
		this.canDelete = canDelete;
	}

}
