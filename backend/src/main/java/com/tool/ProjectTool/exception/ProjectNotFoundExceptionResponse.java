package com.tool.ProjectTool.exception;

public class ProjectNotFoundExceptionResponse {

	private String projectNotFound;

	public String getProjectNotFound() {
		return projectNotFound;
	}

	public void setProjectNotFound(String projectNotFound) {
		this.projectNotFound = projectNotFound;
	}

	public ProjectNotFoundExceptionResponse(String projectNotFound) {
		this.projectNotFound = projectNotFound;
	}
	
}