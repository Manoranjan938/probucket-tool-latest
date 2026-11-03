package com.tool.ProjectTool.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.ActivityLog;
import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.repo.ActivityLogRepository;

@Service
public class ActivityService {

	private static final int PROJECT_FEED_SIZE = 10;

	private static final int TASK_FEED_SIZE = 50;

	@Autowired
	private ActivityLogRepository activityRepo;

	public void recordTaskActivity(ActivityType type, ProjectTask task, String oldValue, String newValue) {

		ActivityLog activity = newActivity(type, task.getProjectIdentifier());
		activity.setTaskSequence(task.getProjectSequence());
		activity.setTaskName(task.getTaskName());
		activity.setOldValue(oldValue);
		activity.setNewValue(newValue);

		activityRepo.save(activity);
	}

	public void recordMemberAdded(String projectIdentifier, String memberName) {

		ActivityLog activity = newActivity(ActivityType.MEMBER_ADDED, projectIdentifier);
		activity.setNewValue(memberName);

		activityRepo.save(activity);
	}

	public List<ActivityResponse> getProjectActivity(String projectIdentifier) {

		return activityRepo
				.findByProjectIdentifierOrderByCreatedAtDescIdDesc(projectIdentifier, PageRequest.of(0, PROJECT_FEED_SIZE))
				.stream().map(this::toResponse).toList();
	}

	public List<ActivityResponse> getTaskActivity(String taskSequence) {

		return activityRepo.findByTaskSequenceOrderByCreatedAtDescIdDesc(taskSequence, PageRequest.of(0, TASK_FEED_SIZE))
				.stream().map(this::toResponse).toList();
	}

	// The actor comes from the login, never from the request, so an entry can't name someone else
	private ActivityLog newActivity(ActivityType type, String projectIdentifier) {

		ActivityLog activity = new ActivityLog();
		activity.setType(type);
		activity.setProjectIdentifier(projectIdentifier);

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Users actor) {
			activity.setActorId(actor.getUserId());
			activity.setActorName(actor.getName());
		}

		return activity;
	}

	private ActivityResponse toResponse(ActivityLog activity) {
		return new ActivityResponse(activity.getId(), activity.getType(), activity.getActorName(),
				activity.getTaskSequence(), activity.getTaskName(), activity.getOldValue(), activity.getNewValue(),
				activity.getCreatedAt());
	}

}
