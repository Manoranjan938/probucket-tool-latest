package com.tool.ProjectTool.exception;

public class UserAlreadyExistExceptionResponse {

	private String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public UserAlreadyExistExceptionResponse(String message) {
		this.message = message;
	}
	
}
