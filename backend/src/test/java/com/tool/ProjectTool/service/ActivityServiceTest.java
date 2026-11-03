package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.tool.ProjectTool.entity.ActivityLog;
import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.repo.ActivityLogRepository;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

	@Mock
	private ActivityLogRepository activityRepo;

	@InjectMocks
	private ActivityService service;

	@AfterEach
	void clearLogin() {
		SecurityContextHolder.clearContext();
	}

	private void loggedInAs(String userId, String name) {
		Users user = new Users();
		user.setUserId(userId);
		user.setName(name);
		SecurityContextHolder.getContext()
				.setAuthentication(new UsernamePasswordAuthenticationToken(user, null, List.of()));
	}

	private ActivityLog saved() {
		ArgumentCaptor<ActivityLog> saved = ArgumentCaptor.forClass(ActivityLog.class);
		verify(activityRepo).save(saved.capture());
		return saved.getValue();
	}

	@Test
	void taskActivityNamesTheLoggedInUserAndTheTask() {
		loggedInAs("user-1", "Asha");
		ProjectTask task = new ProjectTask();
		task.setProjectSequence("AB-1");
		task.setProjectIdentifier("AB");
		task.setTaskName("Ship it");

		service.recordTaskActivity(ActivityType.STATUS_CHANGED, task, "TODO", "COMPLETED");

		ActivityLog activity = saved();
		assertEquals(ActivityType.STATUS_CHANGED, activity.getType());
		assertEquals("AB", activity.getProjectIdentifier());
		assertEquals("AB-1", activity.getTaskSequence());
		assertEquals("Ship it", activity.getTaskName());
		assertEquals("user-1", activity.getActorId());
		assertEquals("Asha", activity.getActorName());
		assertEquals("TODO", activity.getOldValue());
		assertEquals("COMPLETED", activity.getNewValue());
	}

	@Test
	void memberAddedBelongsToTheProjectAndNoTask() {
		loggedInAs("user-1", "Asha");

		service.recordMemberAdded("AB", "Ravi");

		ActivityLog activity = saved();
		assertEquals(ActivityType.MEMBER_ADDED, activity.getType());
		assertEquals("AB", activity.getProjectIdentifier());
		assertNull(activity.getTaskSequence());
		assertEquals("Ravi", activity.getNewValue());
	}

	@Test
	void withoutALoginTheActorIsEmpty() {
		service.recordMemberAdded("AB", "Ravi");

		assertNull(saved().getActorName());
	}

	@Test
	void dashboardFeedAsksForTheLatestTen() {
		ActivityLog activity = new ActivityLog();
		activity.setId(5L);
		activity.setType(ActivityType.COMMENT_ADDED);
		activity.setActorName("Asha");
		when(activityRepo.findByProjectIdentifierOrderByCreatedAtDescIdDesc(eq("AB"), eq(PageRequest.of(0, 10))))
				.thenReturn(List.of(activity));

		List<ActivityResponse> feed = service.getProjectActivity("AB");

		assertEquals(1, feed.size());
		assertEquals("Asha", feed.get(0).actorName());
	}

	@Test
	void taskHistoryAsksForUpToFifty() {
		when(activityRepo.findByTaskSequenceOrderByCreatedAtDescIdDesc(eq("AB-1"), any())).thenReturn(List.of());

		service.getTaskActivity("AB-1");

		verify(activityRepo).findByTaskSequenceOrderByCreatedAtDescIdDesc("AB-1", PageRequest.of(0, 50));
	}

}
