package com.organization.projectManagement.model.request;

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
	
	private String accessType;

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

	public String getAccessType() {
		return accessType;
	}

	public void setAccessType(String accessType) {
		this.accessType = accessType;
	}

}
