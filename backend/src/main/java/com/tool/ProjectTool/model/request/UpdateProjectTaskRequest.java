package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.Size;

public class UpdateProjectTaskRequest {
	
	private String taskId;
	
	private String status;
	
	private String assignee;
	
	private String priority;
	
	@Size(max = ProjectTaskRequest.MAX_DESCRIPTION, message = "Description is too long")
	private String description;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
