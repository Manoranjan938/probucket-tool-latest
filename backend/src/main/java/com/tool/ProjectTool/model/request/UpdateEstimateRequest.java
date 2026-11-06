package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateEstimateRequest {

	@NotBlank
	private String taskId;

	// 1, 2, 3, 5, 8 or 13; null removes the estimate
	private Integer storyPoints;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public Integer getStoryPoints() {
		return storyPoints;
	}

	public void setStoryPoints(Integer storyPoints) {
		this.storyPoints = storyPoints;
	}

}
