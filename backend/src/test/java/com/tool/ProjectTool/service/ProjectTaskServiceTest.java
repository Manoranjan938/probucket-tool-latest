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
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
import com.tool.ProjectTool.model.request.UpdateAssigneeRequest;
import com.tool.ProjectTool.model.request.UpdateBugDetailsRequest;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateEstimateRequest;
import com.tool.ProjectTool.model.request.UpdateLabelsRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
import com.tool.ProjectTool.model.request.UpdateStartDateRequest;
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

	// A project made from the given template, with no tasks yet
	private void projectFrom(String template) {
		ProjectEntity project = new ProjectEntity();
		project.setProjectTemplateType(template);
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		backlog.setProject(project);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);
	}

	private ProjectTask savedTask() {
		ArgumentCaptor<ProjectTask> saved = ArgumentCaptor.forClass(ProjectTask.class);
		verify(projectTaskRepo).save(saved.capture());
		return saved.getValue();
	}

	private ProjectTaskRequest bugRequest() {
		ProjectTaskRequest request = newTask("");
		request.setTaskType("BUG");
		request.setStepsToReproduce(" 1. Open the board ");
		request.setExpectedResult("It loads");
		request.setActualResult("It spins");
		request.setSeverity("MAJOR");
		return request;
	}

	@Test
	void projectManagementProjectsOnlyTakeTasks() {
		projectFrom("project");
		assertThrows(BadRequestException.class, () -> service.addProjectTask(bugRequest()));

		service.addProjectTask(newTask(""));
		assertEquals("TASK", savedTask().getTaskType());
	}

	@Test
	void bugProjectsDefaultToBugsAndKeepTheBugFields() {
		projectFrom("bug");
		ProjectTaskRequest request = bugRequest();
		request.setTaskType("");

		service.addProjectTask(request);

		ProjectTask saved = savedTask();
		assertEquals("BUG", saved.getTaskType());
		assertEquals("1. Open the board", saved.getStepsToReproduce());
		assertEquals("It loads", saved.getExpectedResult());
		assertEquals("It spins", saved.getActualResult());
		assertEquals("MAJOR", saved.getSeverity());
	}

	@Test
	void bugProjectsRefuseTasks() {
		projectFrom("bug");
		ProjectTaskRequest request = newTask("");
		request.setTaskType("TASK");

		assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void mixedProjectsTakeBothAndDropBugFieldsFromTasks() {
		projectFrom("project and bug");
		ProjectTaskRequest request = bugRequest();
		request.setTaskType("TASK");

		service.addProjectTask(request);

		ProjectTask saved = savedTask();
		assertEquals("TASK", saved.getTaskType());
		assertNull(saved.getStepsToReproduce());
		assertNull(saved.getSeverity());
	}

	@Test
	void unknownTypeOrSeverityIsRefused() {
		projectFrom("project and bug");
		ProjectTaskRequest unknownType = newTask("");
		unknownType.setTaskType("EPIC");
		ProjectTaskRequest unknownSeverity = bugRequest();
		unknownSeverity.setSeverity("BLOCKER");

		assertThrows(BadRequestException.class, () -> service.addProjectTask(unknownType));
		assertThrows(BadRequestException.class, () -> service.addProjectTask(unknownSeverity));
	}

	@Test
	void severityIsOptional() {
		projectFrom("bug");
		ProjectTaskRequest request = bugRequest();
		request.setSeverity("");

		service.addProjectTask(request);

		assertNull(savedTask().getSeverity());
	}

	@Test
	void subtasksAreAlwaysTasks() {
		projectFrom("bug");
		ProjectTask parent = task("AB-9", false, null);
		parent.setTaskType("BUG");
		when(projectTaskRepo.findByProjectSequence("AB-9")).thenReturn(parent);

		service.createSubtask(subtaskOf("AB-9"));

		assertEquals("TASK", savedTask().getTaskType());
	}

	private ProjectTask existingBug() {
		ProjectTask bug = task("AB-1", false, null);
		bug.setTaskType("BUG");
		bug.setStepsToReproduce("Steps");
		bug.setExpectedResult("Expected");
		bug.setActualResult("Actual");
		bug.setSeverity("MINOR");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(bug);
		return bug;
	}

	private UpdateBugDetailsRequest bugDetails(String steps, String severity) {
		UpdateBugDetailsRequest request = new UpdateBugDetailsRequest();
		request.setTaskId("AB-1");
		request.setStepsToReproduce(steps);
		request.setExpectedResult("Expected");
		request.setActualResult("Actual");
		request.setSeverity(severity);
		return request;
	}

	@Test
	void bugDetailsChangesAreSavedAndRecordedWithoutTheText() {
		ProjectTask bug = existingBug();

		service.updateBugDetails(bugDetails("New steps", "CRITICAL"));

		assertEquals("New steps", bug.getStepsToReproduce());
		assertEquals("CRITICAL", bug.getSeverity());
		verify(activityService).recordTaskActivity(ActivityType.SEVERITY_CHANGED, bug, "MINOR", "CRITICAL");
		verify(activityService).recordTaskActivity(ActivityType.BUG_DETAILS_CHANGED, bug, null, null);
		verify(activityService, times(2)).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void unchangedBugDetailsRecordNothing() {
		existingBug();

		service.updateBugDetails(bugDetails(" Steps ", "MINOR"));

		verifyNothingRecorded();
	}

	@Test
	void severityCanBeCleared() {
		ProjectTask bug = existingBug();

		service.updateBugDetails(bugDetails("Steps", ""));

		assertNull(bug.getSeverity());
		verify(activityService).recordTaskActivity(ActivityType.SEVERITY_CHANGED, bug, "MINOR", null);
	}

	@Test
	void onlyBugsHaveBugDetails() {
		ProjectTask plain = task("AB-1", false, null);
		plain.setTaskType("TASK");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(plain);

		assertThrows(BadRequestException.class, () -> service.updateBugDetails(bugDetails("Steps", "MINOR")));
		verify(projectTaskRepo, never()).save(any());
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
	void newTaskKeepsItsDescriptionAndAssignee() {
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);
		Users ravi = new Users();
		ravi.setUserId("user-2");
		ravi.setName("Ravi");
		when(userRepo.findByEmail("ravi@example.com")).thenReturn(ravi);
		ProjectTaskRequest request = newTask("");
		request.setDescription("  Steps and notes  ");
		request.setAssignee("ravi@example.com");

		service.addProjectTask(request);

		ArgumentCaptor<ProjectTask> saved = ArgumentCaptor.forClass(ProjectTask.class);
		verify(projectTaskRepo).save(saved.capture());
		assertEquals("Steps and notes", saved.getValue().getTaskDesc());
		assertEquals("user-2", saved.getValue().getAssignee());
		verify(activityService).recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, saved.getValue(), null, "Ravi");
	}

	@Test
	void newTaskWithoutDescriptionOrAssigneeHasNeither() {
		Backlog backlog = new Backlog();
		backlog.setPTSequence(0);
		when(backlogRepo.findByProjectIdentifier("AB")).thenReturn(backlog);
		ProjectTaskRequest request = newTask("");
		request.setDescription("   ");
		request.setAssignee("");

		service.addProjectTask(request);

		ArgumentCaptor<ProjectTask> saved = ArgumentCaptor.forClass(ProjectTask.class);
		verify(projectTaskRepo).save(saved.capture());
		assertNull(saved.getValue().getTaskDesc());
		assertNull(saved.getValue().getAssignee());
		verify(activityService, never()).recordTaskActivity(eq(ActivityType.ASSIGNEE_CHANGED), any(), any(), any());
	}

	@Test
	void newTaskWithAnUnknownAssigneeIsRefused() {
		ProjectTaskRequest request = newTask("");
		request.setAssignee("nobody@example.com");

		assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		verify(projectTaskRepo, never()).save(any());
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
		assertNull(tasks.get(1).getAssigneeEmail());
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

	// Estimate, start date and labels

	private ProjectTask existingTask() {
		ProjectTask existing = task("AB-1", false, null);
		existing.setProjectIdentifier("AB");
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);
		return existing;
	}

	private UpdateStartDateRequest startDateChange(String startDate) {
		UpdateStartDateRequest request = new UpdateStartDateRequest();
		request.setTaskId("AB-1");
		request.setStartDate(startDate);
		return request;
	}

	private UpdateEstimateRequest estimateChange(Integer points) {
		UpdateEstimateRequest request = new UpdateEstimateRequest();
		request.setTaskId("AB-1");
		request.setStoryPoints(points);
		return request;
	}

	private UpdateLabelsRequest labelsChange(String... labels) {
		UpdateLabelsRequest request = new UpdateLabelsRequest();
		request.setTaskId("AB-1");
		request.setLabels(List.of(labels));
		return request;
	}

	@Test
	void newTaskKeepsItsEstimateStartDateAndTidiedLabels() {
		projectFrom("project");
		when(projectTaskRepo.findLabelsByProjectIdentifier("AB")).thenReturn(List.of("UI"));
		ProjectTaskRequest request = newTask("2026-11-20");
		request.setStartDate("2026-11-10");
		request.setStoryPoints(5);
		request.setLabels(List.of(" frontend ", "ui", "Frontend", "  big   bug ", ""));

		service.addProjectTask(request);

		ProjectTask saved = savedTask();
		assertEquals(5, saved.getStoryPoints());
		assertEquals(LocalDate.of(2026, 11, 10), saved.getStartDate());
		// Duplicates merged ignoring case, and "ui" takes the project's spelling
		assertEquals(List.of("frontend", "UI", "big bug"), saved.getLabels());
	}

	@Test
	void newTaskWithoutTheNewFieldsHasNone() {
		projectFrom("project");

		service.addProjectTask(newTask(""));

		ProjectTask saved = savedTask();
		assertNull(saved.getStoryPoints());
		assertNull(saved.getStartDate());
		assertTrue(saved.getLabels().isEmpty());
	}

	@Test
	void newTaskStartingAfterItsDueDateIsRefused() {
		ProjectTaskRequest request = newTask("2026-11-20");
		request.setStartDate("2026-11-21");

		BadRequestException error = assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		assertEquals("The start date can't be after the due date", error.getMessage());

		// The same day is fine
		projectFrom("project");
		request.setStartDate("2026-11-20");
		service.addProjectTask(request);
		assertEquals(LocalDate.of(2026, 11, 20), savedTask().getStartDate());
	}

	@Test
	void onlyFibonacciStoryPointsAreTaken() {
		ProjectTaskRequest request = newTask("");
		request.setStoryPoints(4);

		BadRequestException error = assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		assertEquals("Story points must be 1, 2, 3, 5, 8 or 13", error.getMessage());

		assertThrows(BadRequestException.class, () -> service.updateEstimate(estimateChange(0)));
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void tooManyOrTooLongLabelsAreRefused() {
		ProjectTaskRequest request = newTask("");
		request.setLabels(List.of("a", "b", "c", "d", "e", "f"));
		BadRequestException tooMany = assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		assertEquals("A task can have at most 5 labels", tooMany.getMessage());

		request.setLabels(List.of("x".repeat(31)));
		BadRequestException tooLong = assertThrows(BadRequestException.class, () -> service.addProjectTask(request));
		assertEquals("A label can be at most 30 characters", tooLong.getMessage());

		// Six that merge into five are fine
		projectFrom("project");
		request.setLabels(List.of("a", "b", "c", "d", "e", "A"));
		service.addProjectTask(request);
		assertEquals(5, savedTask().getLabels().size());
	}

	@Test
	void startDateAndDueDateCannotClashEitherWay() {
		ProjectTask existing = existingTask();
		existing.setDueDate(LocalDate.of(2026, 11, 20));

		BadRequestException late = assertThrows(BadRequestException.class,
				() -> service.updateStartDate(startDateChange("2026-11-21")));
		assertEquals("The start date can't be after the due date", late.getMessage());

		existing.setStartDate(LocalDate.of(2026, 11, 10));
		BadRequestException early = assertThrows(BadRequestException.class,
				() -> service.updateDueDate(dueDateChange("2026-11-05")));
		assertEquals("The due date can't be before the start date", early.getMessage());

		verify(projectTaskRepo, never()).save(any());
		verifyNothingRecorded();
	}

	@Test
	void startDateCanBeSetAndRemovedAndIsRecorded() {
		ProjectTask existing = existingTask();

		assertEquals("Start date updated", service.updateStartDate(startDateChange("2026-11-10")));
		assertEquals(LocalDate.of(2026, 11, 10), existing.getStartDate());
		verify(activityService).recordTaskActivity(eq(ActivityType.START_DATE_CHANGED), eq(existing), isNull(), eq("2026-11-10"));

		assertEquals("Start date removed", service.updateStartDate(startDateChange("")));
		assertNull(existing.getStartDate());
		verify(activityService).recordTaskActivity(eq(ActivityType.START_DATE_CHANGED), eq(existing), eq("2026-11-10"), isNull());

		BadRequestException invalid = assertThrows(BadRequestException.class,
				() -> service.updateStartDate(startDateChange("0002-01-01")));
		assertEquals("Invalid start date", invalid.getMessage());
	}

	@Test
	void estimateChangesAreRecordedOnlyWhenTheyChange() {
		ProjectTask existing = existingTask();

		assertEquals("Estimate updated", service.updateEstimate(estimateChange(5)));
		service.updateEstimate(estimateChange(5));
		assertEquals("Estimate removed", service.updateEstimate(estimateChange(null)));

		assertNull(existing.getStoryPoints());
		verify(activityService).recordTaskActivity(eq(ActivityType.ESTIMATE_CHANGED), eq(existing), isNull(), eq("5"));
		verify(activityService).recordTaskActivity(eq(ActivityType.ESTIMATE_CHANGED), eq(existing), eq("5"), isNull());
		verify(activityService, times(2)).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void labelChangesRecordEachAddedAndRemovedLabel() {
		ProjectTask existing = existingTask();
		existing.setLabels(List.of("api", "ui"));
		when(projectTaskRepo.findLabelsByProjectIdentifier("AB")).thenReturn(List.of("api", "ui"));

		assertEquals("Labels updated", service.updateLabels(labelsChange("UI", "backend")));

		assertEquals(List.of("ui", "backend"), existing.getLabels());
		verify(activityService).recordTaskActivity(eq(ActivityType.LABEL_REMOVED), eq(existing), eq("api"), isNull());
		verify(activityService).recordTaskActivity(eq(ActivityType.LABEL_ADDED), eq(existing), isNull(), eq("backend"));
		verify(activityService, times(2)).recordTaskActivity(any(), any(), any(), any());
	}

	@Test
	void changingTheNewFieldsOfAnUnknownTaskFails() {
		assertThrows(TaskIdNotFoundException.class, () -> service.updateStartDate(startDateChange("2026-11-10")));
		assertThrows(TaskIdNotFoundException.class, () -> service.updateEstimate(estimateChange(3)));
		assertThrows(TaskIdNotFoundException.class, () -> service.updateLabels(labelsChange("ui")));
	}

	@Test
	void projectLabelsAreSortedIgnoringCase() {
		when(projectTaskRepo.findLabelsByProjectIdentifier("AB")).thenReturn(List.of("ui", "Backend", "api"));

		assertEquals(List.of("api", "Backend", "ui"), service.getProjectLabels("AB"));
	}

	@Test
	void boardListAndDetailsSendTheNewFields() {
		ProjectTask existing = task("AB-1", false, null);
		existing.setStoryPoints(8);
		existing.setStartDate(LocalDate.of(2026, 11, 10));
		existing.setLabels(List.of("ui"));
		when(projectTaskRepo.findByProjectIdentifierOrderByPriority("AB")).thenReturn(List.of(existing));
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);

		TaskListResponse card = service.getTaskLists("AB").get(0);
		assertEquals(8, card.getStoryPoints());
		assertEquals("2026-11-10", card.getStartDate());
		assertEquals(List.of("ui"), card.getLabels());

		TaskDetails details = service.getTaskDetails("AB-1");
		assertEquals(8, details.getStoryPoints());
		assertEquals("2026-11-10", details.getStartDate());
		assertEquals(List.of("ui"), details.getLabels());
	}

	// Assigning, reassigning and unassigning from the picker

	private Users user(String id, String name, String email) {
		Users user = new Users();
		user.setUserId(id);
		user.setName(name);
		user.setEmail(email);
		return user;
	}

	private UpdateAssigneeRequest assign(String email) {
		UpdateAssigneeRequest request = new UpdateAssigneeRequest();
		request.setTaskId("AB-1");
		request.setAssignee(email);
		return request;
	}

	@Test
	void assigningAnUnassignedTaskRecordsTheNewName() {
		ProjectTask existing = existingTask();
		when(userRepo.findByEmail("ravi@example.com")).thenReturn(user("user-2", "Ravi", "ravi@example.com"));

		assertEquals("Assignee updated", service.updateAssignee(assign("ravi@example.com")));

		assertEquals("user-2", existing.getAssignee());
		verify(activityService).recordTaskActivity(eq(ActivityType.ASSIGNEE_CHANGED), eq(existing), isNull(), eq("Ravi"));
	}

	@Test
	void reassigningRecordsBothNames() {
		ProjectTask existing = existingTask();
		existing.setAssignee("user-1");
		when(userRepo.findByUserId("user-1")).thenReturn(user("user-1", "Asha", "asha@example.com"));
		when(userRepo.findByEmail("ravi@example.com")).thenReturn(user("user-2", "Ravi", "ravi@example.com"));

		service.updateAssignee(assign("ravi@example.com"));

		assertEquals("user-2", existing.getAssignee());
		verify(activityService).recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, existing, "Asha", "Ravi");
	}

	@Test
	void unassigningKeepsTheStatusAndRecordsTheOldName() {
		ProjectTask existing = existingTask();
		existing.setAssignee("user-1");
		existing.setStatus("INPROGRESS");
		when(userRepo.findByUserId("user-1")).thenReturn(user("user-1", "Asha", "asha@example.com"));

		assertEquals("Task unassigned", service.updateAssignee(assign("")));

		assertNull(existing.getAssignee());
		assertEquals("INPROGRESS", existing.getStatus());
		verify(activityService).recordTaskActivity(eq(ActivityType.ASSIGNEE_CHANGED), eq(existing), eq("Asha"), isNull());
		verify(projectTaskRepo).save(existing);
	}

	@Test
	void assigningTheSamePersonOrUnassigningAgainChangesNothing() {
		ProjectTask existing = existingTask();
		existing.setAssignee("user-1");
		when(userRepo.findByEmail("asha@example.com")).thenReturn(user("user-1", "Asha", "asha@example.com"));
		service.updateAssignee(assign("asha@example.com"));

		existing.setAssignee(null);
		service.updateAssignee(assign(null));

		verifyNothingRecorded();
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void assigningAnUnknownPersonOrTaskFails() {
		existingTask();
		BadRequestException unknown = assertThrows(BadRequestException.class, () -> service.updateAssignee(assign("nobody@example.com")));
		assertEquals("The person to assign was not found", unknown.getMessage());

		UpdateAssigneeRequest missing = assign("");
		missing.setTaskId("AB-9");
		assertThrows(TaskIdNotFoundException.class, () -> service.updateAssignee(missing));
		verify(projectTaskRepo, never()).save(any());
	}

	@Test
	void boardListAndDetailsSendTheAssigneesEmail() {
		ProjectTask existing = task("AB-1", false, null);
		existing.setAssignee("user-1");
		Users asha = user("user-1", "Asha", "asha@example.com");
		when(projectTaskRepo.findByProjectIdentifierOrderByPriority("AB")).thenReturn(List.of(existing));
		when(userRepo.findByUserIdIn(Set.of("user-1"))).thenReturn(List.of(asha));
		when(projectTaskRepo.findByProjectSequence("AB-1")).thenReturn(existing);
		when(userRepo.findByUserId("user-1")).thenReturn(asha);

		assertEquals("asha@example.com", service.getTaskLists("AB").get(0).getAssigneeEmail());
		assertEquals("asha@example.com", service.getTaskDetails("AB-1").getAssigneeEmail());
	}

}
