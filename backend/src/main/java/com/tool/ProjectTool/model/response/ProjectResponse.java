package com.tool.ProjectTool.model.response;

import java.util.Date;

public class ProjectResponse {

	private String projectName;
	
	private String projectId;
	
	private String projectIdentifier;

	private String leadBy;

	private String projectType;

	private String projectAvatar;
	
	private Date createdOn;
	
	private String leadEmail;

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

	public String getLeadEmail() {
		return leadEmail;
	}

	public void setLeadEmail(String leadEmail) {
		this.leadEmail = leadEmail;
	}

	public Date getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(Date createdOn) {
		this.createdOn = createdOn;
	}

}
