package com.tool.ProjectTool.model.request;

public class UpdateDueDateRequest {

	private String taskId;
	
	// yyyy-mm-dd, empty or null removes the due date
	private String dueDate;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

}
