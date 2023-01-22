package com.tool.ProjectTool.model.request;

public class UpdateProjectRequest {
	
	private String projectId;
	
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
