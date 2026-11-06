package com.tool.ProjectTool.model.response;

/** Someone who has made a change in a project, for the activity log's person filter */
public record ActivityPersonResponse(String actorId, String name) {

}
