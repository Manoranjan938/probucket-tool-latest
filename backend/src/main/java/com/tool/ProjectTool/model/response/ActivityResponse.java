package com.tool.ProjectTool.model.response;

import java.util.Date;

import com.tool.ProjectTool.entity.ActivityType;

public record ActivityResponse(Long id, ActivityType type, String actorName, String taskSequence, String taskName,
		String oldValue, String newValue, Date createdOn) {

}
