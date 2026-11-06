package com.tool.ProjectTool.model.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateProjectRequest {

	@NotBlank(message = "Project id is required.")
	private String projectId;

	@NotBlank(message = "Enter a project name.")
	private String projectName;
	
	private Long defaultAssignee;

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public Long getDefaultAssignee() {
		return defaultAssignee;
	}

	public void setDefaultAssignee(Long defaultAssignee) {
		this.defaultAssignee = defaultAssignee;
	}

}
