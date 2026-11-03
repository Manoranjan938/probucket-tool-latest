package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
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

import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
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
