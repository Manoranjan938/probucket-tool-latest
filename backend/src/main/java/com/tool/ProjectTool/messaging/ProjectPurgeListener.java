package com.tool.ProjectTool.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.service.ProjectPurgeService;

// Removes projects for good, one at a time
@Component
public class ProjectPurgeListener {

	private final ProjectPurgeService purgeService;

	public ProjectPurgeListener(ProjectPurgeService purgeService) {
		this.purgeService = purgeService;
	}

	@RabbitListener(queues = MessagingConfig.PROJECT_PURGE_QUEUE, concurrency = "1")
	public void purge(ProjectPurgeMessage message) {
		purgeService.purge(message.projectId());
	}
}
