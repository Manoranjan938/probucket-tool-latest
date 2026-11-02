package com.tool.ProjectTool.model.response;

public class NewTeamMemberResponse {

	private String temporaryPassword;

	public NewTeamMemberResponse(String temporaryPassword) {
		this.temporaryPassword = temporaryPassword;
	}

	public String getTemporaryPassword() {
		return temporaryPassword;
	}

	public void setTemporaryPassword(String temporaryPassword) {
		this.temporaryPassword = temporaryPassword;
	}

}
