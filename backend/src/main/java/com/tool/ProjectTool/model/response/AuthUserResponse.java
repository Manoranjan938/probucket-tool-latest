package com.tool.ProjectTool.model.response;

import com.tool.ProjectTool.entity.Users;

public class AuthUserResponse {

	private String id;

	private String username;

	private String fullName;

	private String rolename;

	public AuthUserResponse(Users user) {
		this.id = user.getUserId();
		this.username = user.getUsername();
		this.fullName = user.getName();
		this.rolename = user.getRoleName();
	}

	public String getId() {
		return id;
	}

	public String getUsername() {
		return username;
	}

	public String getFullName() {
		return fullName;
	}

	public String getRolename() {
		return rolename;
	}

}
