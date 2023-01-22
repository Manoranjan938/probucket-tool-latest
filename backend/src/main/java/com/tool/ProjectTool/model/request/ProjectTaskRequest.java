package com.tool.ProjectTool.model.request;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class ProjectTaskRequest {

	@NotNull
	@NotBlank
	private String projectIdentifier;
	
	@NotNull
	@NotBlank
	private String taskName;
	
	private String sprintId;
	
	private String priority;
	
	private String status;

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
