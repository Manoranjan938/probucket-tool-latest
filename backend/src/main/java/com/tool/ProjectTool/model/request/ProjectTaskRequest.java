package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ProjectTaskRequest {

	// Also used by UpdateProjectTaskRequest
	public static final int MAX_DESCRIPTION = 10000;

	@NotNull
	@NotBlank
	private String projectIdentifier;
	
	@NotNull
	@NotBlank
	private String taskName;
	
	private String sprintId;
	
	private String priority;
	
	private String status;
	
	// yyyy-mm-dd, optional
	private String dueDate;

	@Size(max = MAX_DESCRIPTION, message = "Description is too long")
	private String description;

	// Email of the person to assign, optional
	private String assignee;

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getPriority() {
		return priority;
	}

	public void setPriority(String priority) {
		this.priority = priority;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getProjectIdentifier() {
		return projectIdentifier;
	}

	public void setProjectIdentifier(String projectIdentifier) {
		this.projectIdentifier = projectIdentifier;
	}

	public String getSprintId() {
		return sprintId;
	}

	public void setSprintId(String sprintId) {
		this.sprintId = sprintId;
	}
	
}
