package com.tool.ProjectTool.model.response;

import java.util.Date;
import java.util.List;

public class TaskListResponse {

	private String taskName;
	
	private String taskType;
	
	private String taskSequence;
	
	private String priority;
	
	private String status;
	
	private String assignee;
	
	private String assigneeName;
	
	// yyyy-mm-dd, null when the task has no due date
	private String dueDate;
	
	private Date createdOn;
	
	// Null until the task is changed for the first time
	private Date updatedOn;
	
	private boolean subtask;
	
	private String parentTaskId;
	
	private int subtaskCount;

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

	public Date getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(Date updatedOn) {
		this.updatedOn = updatedOn;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

	public String getAssigneeName() {
		return assigneeName;
	}

	public void setAssigneeName(String assigneeName) {
		this.assigneeName = assigneeName;
	}

	public boolean isSubtask() {
		return subtask;
	}

	public void setSubtask(boolean subtask) {
		this.subtask = subtask;
	}

	public String getParentTaskId() {
		return parentTaskId;
	}

	public void setParentTaskId(String parentTaskId) {
		this.parentTaskId = parentTaskId;
	}

	public int getSubtaskCount() {
		return subtaskCount;
	}

	public void setSubtaskCount(int subtaskCount) {
		this.subtaskCount = subtaskCount;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getTaskType() {
		return taskType;
	}

	public void setTaskType(String taskType) {
		this.taskType = taskType;
	}

	public String getTaskSequence() {
		return taskSequence;
	}

	public void setTaskSequence(String taskSequence) {
		this.taskSequence = taskSequence;
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

	public String getAssignee() {
		return assignee;
	}

	public void setAssignee(String assignee) {
		this.assignee = assignee;
	}

	private Integer storyPoints;

	// yyyy-mm-dd
	private String startDate;

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

	// The assignee's email, so a picker can mark them; null when nobody is assigned
	private String assigneeEmail;

	public String getAssigneeEmail() {
		return assigneeEmail;
	}

	public void setAssigneeEmail(String assigneeEmail) {
		this.assigneeEmail = assigneeEmail;
	}

}
