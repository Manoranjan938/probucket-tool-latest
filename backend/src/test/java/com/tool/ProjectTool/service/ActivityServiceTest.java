package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.LongStream;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import com.tool.ProjectTool.entity.ActivityLog;
import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.messaging.ActivityMessage;
import com.tool.ProjectTool.messaging.JobPublisher;
import com.tool.ProjectTool.messaging.MessagingConfig;
import com.tool.ProjectTool.model.response.ActivityPageResponse;
import com.tool.ProjectTool.model.response.ActivityPersonResponse;
import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.repo.ActivityLogRepository;

@ExtendWith(MockitoExtension.class)
class ActivityServiceTest {

	@Mock
	private ActivityLogRepository activityRepo;

	@Mock
	private JobPublisher publisher;

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

	// Recording only queues the entry; the activity queue then saves it. This does both, like the app does.
	private ActivityLog saved() {
		verify(activityRepo, never()).save(any());
		ArgumentCaptor<ActivityMessage> queued = ArgumentCaptor.forClass(ActivityMessage.class);
		verify(publisher).publish(eq(MessagingConfig.ACTIVITY_ROUTING_KEY), queued.capture());

		service.save(queued.getValue());
		ArgumentCaptor<ActivityLog> saved = ArgumentCaptor.forClass(ActivityLog.class);
		verify(activityRepo).save(saved.capture());
		return saved.getValue();
	}

	// Saved a moment later, the entry still carries the time of the change, so it sorts in its place
	@Test
	void anEntryKeepsTheTimeOfTheChange() {
		Instant changedAt = Instant.parse("2026-11-07T10:00:00Z");
		service.save(new ActivityMessage(ActivityType.STATUS_CHANGED, "AB", "AB-1", "Ship it", "TODO", "COMPLETED",
				"user-1", "Asha", changedAt));

		ArgumentCaptor<ActivityLog> saved = ArgumentCaptor.forClass(ActivityLog.class);
		verify(activityRepo).save(saved.capture());
		assertEquals(Date.from(changedAt), saved.getValue().getCreatedAt());
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

	private static ActivityLog entry(long id, String projectIdentifier) {
		ActivityLog activity = new ActivityLog();
		activity.setId(id);
		activity.setType(ActivityType.STATUS_CHANGED);
		activity.setProjectIdentifier(projectIdentifier);
		return activity;
	}

	private static ActivityLogRepository.Actor actor(String actorId, String actorName) {
		return new ActivityLogRepository.Actor() {
			public String getActorId() {
				return actorId;
			}

			public String getActorName() {
				return actorName;
			}
		};
	}

	@SuppressWarnings("unchecked")
	private void logReturns(List<ActivityLog> found) {
		when(activityRepo.findBy(any(Specification.class), any())).thenReturn(found);
	}

	@Test
	void logPageHasMoreWhenAnotherEntryMatches() {
		logReturns(LongStream.rangeClosed(1, ActivityService.LOG_PAGE_SIZE + 1).mapToObj(id -> entry(id, "AB")).toList());

		ActivityPageResponse page = service.getProjectActivityLog("AB", null, null, null, null, null);

		assertEquals(ActivityService.LOG_PAGE_SIZE, page.items().size());
		assertTrue(page.hasMore());
	}

	@Test
	void lastLogPageHasNoMore() {
		logReturns(List.of(entry(1, "AB")));

		ActivityPageResponse page = service.getProjectActivityLog("AB", null, null, List.of(ActivityType.COMMENT_ADDED),
				null, null);

		assertEquals(1, page.items().size());
		assertFalse(page.hasMore());
	}

	@SuppressWarnings("unchecked")
	@Test
	void logPageAfterAnotherProjectsEntryIsEmpty() {
		when(activityRepo.findById(7L)).thenReturn(Optional.of(entry(7, "OTHER")));

		ActivityPageResponse page = service.getProjectActivityLog("AB", 7L, null, null, null, null);

		assertTrue(page.items().isEmpty());
		assertFalse(page.hasMore());
		verify(activityRepo, never()).findBy(any(Specification.class), any());
	}

	@Test
	void logPageContinuesAfterTheGivenEntry() {
		ActivityLog last = entry(7, "AB");
		last.setCreatedAt(new Date());
		when(activityRepo.findById(7L)).thenReturn(Optional.of(last));
		logReturns(List.of(entry(6, "AB")));

		ActivityPageResponse page = service.getProjectActivityLog("AB", 7L, null, null, null, null);

		assertEquals(6L, page.items().get(0).id());
	}

	@Test
	void peopleAppearOnceByTheirLatestNameSortedByName() {
		// The repository lists the latest name first
		when(activityRepo.findActors("AB")).thenReturn(
				List.of(actor("u2", "ravi"), actor("u1", "Asha K"), actor("u2", "Ravi old"), actor("u1", "Asha")));

		List<ActivityPersonResponse> people = service.getProjectActivityPeople("AB");

		assertEquals(List.of(new ActivityPersonResponse("u1", "Asha K"), new ActivityPersonResponse("u2", "ravi")),
				people);
	}

}
