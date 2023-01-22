package com.tool.ProjectTool.model.request;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

public class UserRequest {

	@NotBlank
	@Email(message = "Invalid Email")
	private String username;
	
	@NotBlank
	private String password;
	
	@NotBlank
	private String name;
	
	private String roleName;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
}
