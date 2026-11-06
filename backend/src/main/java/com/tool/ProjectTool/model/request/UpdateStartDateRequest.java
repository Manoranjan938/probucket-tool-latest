package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateStartDateRequest {

	@NotBlank
	private String taskId;

	// yyyy-mm-dd, empty or null removes the start date
	private String startDate;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

}
