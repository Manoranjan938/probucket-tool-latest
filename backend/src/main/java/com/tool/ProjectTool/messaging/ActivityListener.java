package com.tool.ProjectTool.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.service.ActivityService;

// Saves activity entries. One consumer, so entries are saved in the order they happened.
@Component
public class ActivityListener {

	private final ActivityService activityService;

	public ActivityListener(ActivityService activityService) {
		this.activityService = activityService;
	}

	@RabbitListener(queues = MessagingConfig.ACTIVITY_QUEUE, concurrency = "1")
	public void save(ActivityMessage message) {
		activityService.save(message);
	}
}
