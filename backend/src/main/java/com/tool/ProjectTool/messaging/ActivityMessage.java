package com.tool.ProjectTool.messaging;

import java.time.Instant;

import com.tool.ProjectTool.entity.ActivityType;

/**
 * One activity entry waiting to be saved. Who made the change and when are taken at the time of the change,
 * since the login isn't known on the queue and the entry may be saved a moment later.
 */
public record ActivityMessage(ActivityType type, String projectIdentifier, String taskSequence, String taskName,
		String oldValue, String newValue, String actorId, String actorName, Instant createdAt) {
}
