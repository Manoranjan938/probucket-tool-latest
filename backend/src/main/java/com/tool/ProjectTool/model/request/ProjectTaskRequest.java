package com.tool.ProjectTool.model.request;

import java.util.List;

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

	// TASK or BUG; empty takes the project's default
	private String taskType;

	// The rest is only kept on a bug
	@Size(max = MAX_DESCRIPTION, message = "Steps to reproduce are too long")
	private String stepsToReproduce;

	@Size(max = MAX_DESCRIPTION, message = "Expected result is too long")
	private String expectedResult;

	@Size(max = MAX_DESCRIPTION, message = "Actual result is too long")
	private String actualResult;

	private String severity;

	// 1, 2, 3, 5, 8 or 13, optional
	private Integer storyPoints;

	// yyyy-mm-dd, optional, not after the due date
	private String startDate;

	// Up to 5, each up to 30 characters
	private List<String> labels;

	public Integer getStoryPoints() {
		return storyPoints;
	}

	public void setStoryPoints(Integer storyPoints) {
		this.storyPoints = storyPoints;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public List<String> getLabels() {
		return labels;
	}

	public void setLabels(List<String> labels) {
		this.labels = labels;
	}

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

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
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
