package com.organization.projectManagement.model.response;

public class ProjectResponse {

	private String projectName;
	
	private String leadBy;
	
	private String projectType;
	
	private String projectAvatar;

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getLeadBy() {
		return leadBy;
	}

	public void setLeadBy(String leadBy) {
		this.leadBy = leadBy;
	}

	public String getProjectType() {
		return projectType;
	}

	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}

	public String getProjectAvatar() {
		return projectAvatar;
	}

	public void setProjectAvatar(String projectAvatar) {
		this.projectAvatar = projectAvatar;
	}
	
}
