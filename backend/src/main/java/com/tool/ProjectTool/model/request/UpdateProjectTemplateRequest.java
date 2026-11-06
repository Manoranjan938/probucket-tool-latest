package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateProjectTemplateRequest {

	@NotBlank(message = "Project id is required.")
	private String projectId;

	/** "project", "bug" or "project and bug" */
	@NotBlank(message = "Choose a template.")
	private String projectTemplate;

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectTemplate() {
		return projectTemplate;
	}

	public void setProjectTemplate(String projectTemplate) {
		this.projectTemplate = projectTemplate;
	}

}
