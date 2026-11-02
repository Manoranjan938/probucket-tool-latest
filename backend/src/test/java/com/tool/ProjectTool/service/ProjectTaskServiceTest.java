package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
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
