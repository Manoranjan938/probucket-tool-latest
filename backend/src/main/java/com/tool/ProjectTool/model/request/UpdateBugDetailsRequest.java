package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// The fields only a bug has. Sent separately from UpdateProjectTaskRequest, so a status or assignee change never touches them.
public class UpdateBugDetailsRequest {

	@NotBlank
	private String taskId;

	@Size(max = ProjectTaskRequest.MAX_DESCRIPTION, message = "Steps to reproduce are too long")
	private String stepsToReproduce;

	@Size(max = ProjectTaskRequest.MAX_DESCRIPTION, message = "Expected result is too long")
	private String expectedResult;

	@Size(max = ProjectTaskRequest.MAX_DESCRIPTION, message = "Actual result is too long")
	private String actualResult;

	// MINOR, MAJOR or CRITICAL; empty clears it
	private String severity;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getStepsToReproduce() {
		return stepsToReproduce;
	}

	public void setStepsToReproduce(String stepsToReproduce) {
		this.stepsToReproduce = stepsToReproduce;
	}

	public String getExpectedResult() {
		return expectedResult;
	}

	public void setExpectedResult(String expectedResult) {
		this.expectedResult = expectedResult;
	}

	public String getActualResult() {
		return actualResult;
	}

	public void setActualResult(String actualResult) {
		this.actualResult = actualResult;
	}

	public String getSeverity() {
		return severity;
	}

	public void setSeverity(String severity) {
		this.severity = severity;
	}

}
