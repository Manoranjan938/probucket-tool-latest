package com.tool.ProjectTool.model.response;

import java.util.Date;

/** A project in the lead's Recently deleted list. deleteForeverOn is when it will be removed for good. */
public record DeletedProjectResponse(String projectId, String projectName, String projectIdentifier, String projectType,
		Date deletedOn, Date deleteForeverOn) {

}
