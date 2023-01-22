package com.tool.ProjectTool.exception;

public class UserNotFoundExceptionResponse {

	private String email;

	public UserNotFoundExceptionResponse(String email) {
		// TODO Auto-generated constructor stub
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
	
}
