package com.tool.ProjectTool.exception;

public class TaskIdNotFoundExceptionResponse {

	private String taskId;

	public String getTaskId() {
		return taskId;
	}

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public TaskIdNotFoundExceptionResponse(String taskId) {
		this.taskId = taskId;
	}
	
}
