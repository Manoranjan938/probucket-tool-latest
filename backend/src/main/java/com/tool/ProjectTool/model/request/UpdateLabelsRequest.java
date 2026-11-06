package com.tool.ProjectTool.model.request;

import java.util.List;

import jakarta.validation.constraints.NotBlank;

public class UpdateLabelsRequest {

	@NotBlank
	private String taskId;

	// The task's labels after the change, up to 5
	private List<String> labels;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public List<String> getLabels() {
		return labels;
	}

	public void setLabels(List<String> labels) {
		this.labels = labels;
	}

}
