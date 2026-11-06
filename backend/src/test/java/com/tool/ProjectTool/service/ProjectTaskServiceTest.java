package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
import com.tool.ProjectTool.model.response.SubtaskList;
import com.tool.ProjectTool.model.response.TaskDetails;
import com.tool.ProjectTool.model.response.TaskListResponse;
import com.tool.ProjectTool.repo.BacklogRepository;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.ProjectTaskRepository;
import com.tool.ProjectTool.repo.UserRepository;

@ExtendWith(MockitoExtension.class)
class ProjectTaskServiceTest {

	@Mock
	private BacklogRepository backlogRepo;

	@Mock
	private ProjectTaskRepository projectTaskRepo;

	@Mock
	private UserRepository userRepo;

	@Mock
	private ProjectRepository projRepo;

	@Mock
	private ActivityService activityService;

	@InjectMocks
	private ProjectTaskService service;

	private ProjectTask task(String sequence, boolean subtask, String parent) {
		ProjectTask task = new ProjectTask();
		task.setProjectSequence(sequence);
		task.setSubtask(subtask);
		task.setParentTaskId(parent);
		return task;
	}

	private RequestCreateSubtask subtaskOf(String parent) {
		RequestCreateSubtask request = new RequestCreateSubtask();
		request.setProjectId("AB");
		request.setParentTaskId(parent);
		request.setTaskName("Child");
		return request;
	}

	private ProjectTaskRequest newTask(String dueDate) {
		ProjectTaskRequest request = new ProjectTaskRequest();
		request.setProjectIdentifier("AB");
		request.setTaskName("Task");
		request.setDueDate(dueDate);
		return request;
	}

	private UpdateDueDateRequest dueDateChange(String dueDate) {
		UpdateDueDateRequest request = new UpdateDueDateRequest();
		request.setTaskId("AB-1");
		request.setDueDate(dueDate);
		return request;
	}

	private ProjectTask unchangedTask() {
		ProjectTask existing = task("AB-1", false, null);
		existing.setStatus("TODO");
		existing.setPriority("LOW");
		existing.setTaskDesc("Words");
		existing.setAssignee("user-1");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);
		return existing;
	}

	private UpdateProjectTaskRequest sameAs(ProjectTask existing) {
		UpdateProjectTaskRequest request = new UpdateProjectTaskRequest();
		request.setTaskId(existing.getProjectSequence());
		request.setStatus(existing.getStatus());
		request.setPriority(existing.getPriority());
		request.setDescription(existing.getTaskDesc());
		return request;
	}

	private void verifyNothingRecorded() {
		verify(activityService, never()).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void savingWithoutChangesRecordsNothing() {
		ProjectTask existing = unchangedTask();

		service.updateTask(sameAs(existing));

		verifyNothingRecorded();
	}

	@Test
	void emptyAndMissingDescriptionsCountAsTheSame() {
		ProjectTask existing = unchangedTask();
		existing.setTaskDesc(null);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setDescription("");

		service.updateTask(request);

		verifyNothingRecorded();
	}

	@Test
	void eachChangedFieldIsRecordedOnce() {
		ProjectTask existing = unchangedTask();
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setStatus("INPROGRESS");
		request.setPriority("HIGH");

		service.updateTask(request);

		verify(activityService).recordTaskActivity(ActivityType.STATUS_CHANGED, existing, "TODO", "INPROGRESS");
		verify(activityService).recordTaskActivity(ActivityType.PRIORITY_CHANGED, existing, "LOW", "HIGH");
		verify(activityService, times(2)).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void descriptionChangeNeverRecordsTheText() {
		ProjectTask existing = unchangedTask();
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setDescription("Private words");

		service.updateTask(request);

		verify(activityService).recordTaskActivity(ActivityType.DESCRIPTION_CHANGED, existing, null, null);
	}

	@Test
	void assigneeChangeRecordsBothNames() {
		ProjectTask existing = unchangedTask();
		Users oldUser = new Users();
		oldUser.setUserId("user-1");
		oldUser.setName("Asha");
		Users newUser = new Users();
		newUser.setUserId("user-2");
		newUser.setName("Ravi");
		when(userRepo.findByUserId("user-1")).thenReturn(oldUser);
		when(userRepo.findByEmail("ravi@example.com")).thenReturn(newUser);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setAssignee("ravi@example.com");

		service.updateTask(request);

		verify(activityService).recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, existing, "Asha", "Ravi");
		assertEquals("user-2", existing.getAssignee());
	}

	@Test
	void unassignedTaskCannotChangeStatus() {
		ProjectTask existing = unchangedTask();
		existing.setAssignee(null);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setStatus("INPROGRESS");

		assertThrows(BadRequestException.class, () -> service.updateTask(request));

		assertEquals("TODO", existing.getStatus());
		verify(projectTaskRepo, never()).save(any());
		verifyNothingRecorded();
	}

	@Test
	void unassignedTaskCanStillBeSavedWithItsStatus() {
		ProjectTask existing = unchangedTask();
		existing.setAssignee(null);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setPriority("HIGH");

		service.updateTask(request);

		verify(projectTaskRepo).save(existing);
		assertEquals("HIGH", existing.getPriority());
	}

	@Test
	void assigningAndChangingStatusTogetherIsAllowed() {
		ProjectTask existing = unchangedTask();
		existing.setAssignee(null);
		Users newUser = new Users();
		newUser.setUserId("user-2");
		newUser.setName("Ravi");
		when(userRepo.findByEmail("ravi@example.com")).thenReturn(newUser);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setAssignee("ravi@example.com");
		request.setStatus("INPROGRESS");

		service.updateTask(request);

		assertEquals("INPROGRESS", existing.getStatus());
		assertEquals("user-2", existing.getAssignee());
	}

	@Test
	void reassigningTheSamePersonRecordsNothing() {
		ProjectTask existing = unchangedTask();
		Users same = new Users();
		same.setUserId("user-1");
		when(userRepo.findByEmail("asha@example.com")).thenReturn(same);
		UpdateProjectTaskRequest request = sameAs(existing);
		request.setAssignee("asha@example.com");

		service.updateTask(request);

		verifyNothingRecorded();
	}

	@Test
	void dueDateChangesAreRecordedWithBothDates() {
		ProjectTask existing = task("AB-1", false, null);
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);

		service.updateDueDate(dueDateChange("2026-11-20"));
		verify(activityService).recordTaskActivity(ActivityType.DUE_DATE_CHANGED, existing, null, "2026-11-20");

		service.updateDueDate(dueDateChange("2026-11-20"));
		service.updateDueDate(dueDateChange(""));
		verify(activityService).recordTaskActivity(ActivityType.DUE_DATE_CHANGED, existing, "2026-11-20", null);
		verify(activityService, times(2)).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void creatingTasksIsRecorded() {
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);
		when(projectTaskRepo.findByProjectSequence("AB-9")).thenReturn(task("AB-9", false, null));

		service.addProjectTask(newTask(""));
		verify(activityService).recordTaskActivity(eq(ActivityType.TASK_CREATED), any(), isNull(), isNull());

		service.createSubtask(subtaskOf("AB-9"));
		verify(activityService).recordTaskActivity(eq(ActivityType.SUBTASK_CREATED), any(), isNull(), eq("AB-9"));
	}

	@Test
	void newTaskKeepsItsDueDate() {
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);

		service.addProjectTask(newTask("2026-11-20"));

		ArgumentCaptor<ProjectTask> saved = ArgumentCaptor.forClass(ProjectTask.class);
		verify(projectTaskRepo).save(saved.capture());
		assertEquals(LocalDate.of(2026, 11, 20), saved.getValue().getDueDate());
	}

	@Test
	void newTaskWithoutADueDateHasNone() {
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);

		service.addProjectTask(newTask(""));

		ArgumentCaptor<ProjectTask> saved = ArgumentCaptor.forClass(ProjectTask.class);
		verify(projectTaskRepo).save(saved.capture());
		assertNull(saved.getValue().getDueDate());
	}

	@Test
	void invalidDueDateIsReportedAsSuch() {
		for (String invalid : List.of("soon", "2026-13-01", "2026-02-30", "0002-11-20", "2999-01-01")) {
			assertThrows(BadRequestException.class, () -> service.addProjectTask(newTask(invalid)), invalid);
			assertThrows(BadRequestException.class, () -> service.updateDueDate(dueDateChange(invalid)), invalid);
		}
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void dueDateCanBeSetAndRemoved() {
		ProjectTask existing = task("AB-1", false, null);
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);

		service.updateDueDate(dueDateChange("2026-11-20"));
		assertEquals(LocalDate.of(2026, 11, 20), existing.getDueDate());

		service.updateDueDate(dueDateChange(""));
		assertNull(existing.getDueDate());

		existing.setDueDate(LocalDate.of(2026, 11, 20));
		service.updateDueDate(dueDateChange(null));
		assertNull(existing.getDueDate());
	}

	@Test
	void changingTheDueDateOfAnUnknownTaskFails() {
		assertThrows(TaskIdNotFoundException.class, () -> service.updateDueDate(dueDateChange("2026-11-20")));
	}

	@Test
	void updatingATaskKeepsItsDueDate() {
		ProjectTask existing = task("AB-1", false, null);
		existing.setDueDate(LocalDate.of(2026, 11, 20));
		// Only an assigned task can change its status
		existing.setAssignee("user-1");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);
		UpdateProjectTaskRequest request = new UpdateProjectTaskRequest();
		request.setTaskId("AB-1");
		request.setStatus("COMPLETED");

		service.updateTask(request);

		assertEquals(LocalDate.of(2026, 11, 20), existing.getDueDate());
	}

	@Test
	void boardListAndDetailsSendTheDueDateWithoutATime() {
		ProjectTask dated = task("AB-1", false, null);
		dated.setDueDate(LocalDate.of(2026, 11, 20));
		when(projectTaskRepo.findByProjectIdentifierOrderByPriority("AB"))
				.thenReturn(List.of(dated, task("AB-2", false, null)));
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(dated);

		List<TaskListResponse> tasks = service.getTaskLists("AB");

		assertEquals("2026-11-20", tasks.get(0).getDueDate());
		assertNull(tasks.get(1).getDueDate());
		assertEquals("2026-11-20", service.getTaskDetails("AB-1").getDueDate());
	}

	@Test
	void boardListSendsTheAssigneeAndTheirName() {
		ProjectTask assigned = task("AB-1", false, null);
		assigned.setAssignee("user-1");
		Users user = new Users();
		user.setUserId("user-1");
		user.setName("Asha");
		when(projectTaskRepo.findByProjectIdentifierOrderByPriority("AB"))
				.thenReturn(List.of(assigned, task("AB-2", false, null)));
		when(userRepo.findByUserIdIn(Set.of("user-1"))).thenReturn(List.of(user));

		List<TaskListResponse> tasks = service.getTaskLists("AB");

		assertEquals("user-1", tasks.get(0).getAssignee());
		assertEquals("Asha", tasks.get(0).getAssigneeName());
		assertNull(tasks.get(1).getAssignee());
		assertNull(tasks.get(1).getAssigneeName());
	}

	@Test
	void subtaskListSendsTheAssigneesNameOrNA() {
		Object[] assigned = { "Assigned", "TASK", "AB-2", "HIGH", "TODO", "user-1", true, "AB-1" };
		Object[] unassigned = { "Unassigned", "TASK", "AB-3", "LOW", "TODO", null, true, "AB-1" };
		Users user = new Users();
		user.setUserId("user-1");
		user.setName("Asha");
		when(projectTaskRepo.findSubtaskListByParentId("AB-1")).thenReturn(List.<Object>of(assigned, unassigned));
		when(userRepo.findByUserIdIn(Set.of("user-1"))).thenReturn(List.of(user));

		List<SubtaskList> subtasks = service.getSubTaskList("AB-1");

		assertEquals("Asha", subtasks.get(0).getAssignee());
		assertEquals("NA", subtasks.get(1).getAssignee());
	}

	@Test
	void boardListMarksSubtasksAndCountsThemOnTheParent() {
		when(projectTaskRepo.findByProjectIdentifierOrderByPriority("AB")).thenReturn(List.of(
				task("AB-1", false, null), task("AB-2", true, "AB-1"), task("AB-3", true, "AB-1"),
				task("AB-4", false, null)));

		List<TaskListResponse> tasks = service.getTaskLists("AB");

		assertFalse(tasks.get(0).isSubtask());
		assertEquals(2, tasks.get(0).getSubtaskCount());
		assertTrue(tasks.get(1).isSubtask());
		assertEquals("AB-1", tasks.get(1).getParentTaskId());
		assertEquals(0, tasks.get(1).getSubtaskCount());
		assertEquals(0, tasks.get(3).getSubtaskCount());
	}

	@Test
	void taskDetailsNameTheParent() {
		when(projectTaskRepo.findByProjectSequence("AB-2")).thenReturn(task("AB-2", true, "AB-1"));

		TaskDetails details = service.getTaskDetails("AB-2");

		assertTrue(details.isSubtask());
		assertEquals("AB-1", details.getParentTaskId());
	}

	@Test
	void subtaskOfASubtaskIsRejected() {
		when(projectTaskRepo.findByProjectSequence("AB-2")).thenReturn(task("AB-2", true, "AB-1"));

		assertThrows(BadRequestException.class, () -> service.createSubtask(subtaskOf("AB-2")));
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void subtaskOfAnUnknownTaskIsRejected() {
		when(projectTaskRepo.findByProjectSequence("AB-9")).thenReturn(null);

		assertThrows(TaskIdNotFoundException.class, () -> service.createSubtask(subtaskOf("AB-9")));
		verify(projectTaskRepo, never()).save(any());
	}

}
