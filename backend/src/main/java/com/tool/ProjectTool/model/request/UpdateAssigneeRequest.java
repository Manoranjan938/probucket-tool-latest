package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateAssigneeRequest {

	@NotBlank
	private String taskId;

	// Email of the person to assign; empty or null unassigns the task
	private String assignee;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

}
