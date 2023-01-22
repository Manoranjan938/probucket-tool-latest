package com.tool.ProjectTool.model.response;

public class ProjectResponse {

	private String projectName;
	
	private String projectId;
	
	private String projectIdentifier;

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

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectIdentifier() {
		return projectIdentifier;
	}

	public void setProjectIdentifier(String projectIdentifier) {
		this.projectIdentifier = projectIdentifier;
	}

}
