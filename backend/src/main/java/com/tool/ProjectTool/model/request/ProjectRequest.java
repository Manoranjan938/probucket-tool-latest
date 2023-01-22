package com.tool.ProjectTool.model.request;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class ProjectRequest {

	@NotNull(message = "Project name is required.")
	@Size(min = 1, message = "Project name is required.")
	private String projectName;
	
	@NotNull(message = "Project template is required.")
	@Size(min = 1, message = "Project template is required.")
	private String projectTemplate;
	
	@NotNull(message = "Project type is required.")
	@Size(min = 1, message = "Project type is required.")
	private String projectType;
	
	private String projectDesc;
	
	private String userId;

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectTemplate() {
		return projectTemplate;
	}

	public void setProjectTemplate(String projectTemplate) {
		this.projectTemplate = projectTemplate;
	}

	public String getProjectType() {
		return projectType;
	}

	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}

	public String getProjectDesc() {
		return projectDesc;
	}

	public void setProjectDesc(String projectDesc) {
		this.projectDesc = projectDesc;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public ProjectRequest() {
		super();
	}
	
}
