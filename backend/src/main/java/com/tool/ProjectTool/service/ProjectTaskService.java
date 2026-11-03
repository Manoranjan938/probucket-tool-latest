package com.tool.ProjectTool.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.BadRequestException;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
import com.tool.ProjectTool.model.response.HomeTaskCounts;
import com.tool.ProjectTool.model.response.StatisticsResponse;
import com.tool.ProjectTool.model.response.SubtaskList;
import com.tool.ProjectTool.model.response.TaskDetails;
import com.tool.ProjectTool.model.response.TaskListResponse;
import com.tool.ProjectTool.repo.BacklogRepository;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.ProjectTaskRepository;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class ProjectTaskService {

	private static final int MIN_DUE_YEAR = 2000;

	private static final int MAX_DUE_YEAR = 2100;

	@Autowired
	private BacklogRepository backlogRepo;

	@Autowired
	private ProjectTaskRepository projectTaskRepo;

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ProjectRepository projRepo;

	@Autowired
	private ActivityService activityService;

	@Transactional
	public String addProjectTask(ProjectTaskRequest request) {

		LocalDate dueDate = parseDueDate(request.getDueDate());

		try {
			Backlog back = backlogRepo.findByProjectIdentifier(request.getProjectIdentifier());

			ProjectTask projTask = new ProjectTask();
			projTask.setBacklog(back);

			Integer backlogSequesnce = back.getPTSequence();
			backlogSequesnce++;
			back.setPTSequence(backlogSequesnce);

			projTask.setProjectSequence(request.getProjectIdentifier() + "-" + backlogSequesnce);
			projTask.setProjectIdentifier(request.getProjectIdentifier());

			if (request.getPriority() == "" || request.getPriority() == null) {
				projTask.setPriority("LOW");
			}
			if (request.getStatus() == "" || request.getStatus() == null) {
				projTask.setStatus("TODO");
			}

			projTask.setPriority(request.getPriority());
			projTask.setTaskName(request.getTaskName());
			;
			projTask.setSprintId(request.getSprintId());
			projTask.setDueDate(dueDate);
			projTask.setSubtask(false);

			projectTaskRepo.save(projTask);
			activityService.recordTaskActivity(ActivityType.TASK_CREATED, projTask, null, null);

			return "Task created successfully";
		} catch (Exception e) {
			throw new ProjectNotFoundException("Project not found");
		}
	}

	public List<TaskListResponse> getTaskLists(String backlogId) {

		List<ProjectTask> tasks = projectTaskRepo.findByProjectIdentifierOrderByPriority(backlogId);
		if (!tasks.isEmpty()) {
			List<TaskListResponse> taskLists = new ArrayList<>();

			Map<String, Integer> subtaskCounts = new HashMap<>();
			Set<String> assigneeIds = new HashSet<>();
			for (ProjectTask project : tasks) {
				if (project.isSubtask()) {
					subtaskCounts.merge(project.getParentTaskId(), 1, Integer::sum);
				}
				if (project.getAssignee() != null) {
					assigneeIds.add(project.getAssignee());
				}
			}

			Map<String, String> assigneeNames = new HashMap<>();
			for (Users user : userRepo.findByUserIdIn(assigneeIds)) {
				assigneeNames.put(user.getUserId(), user.getName());
			}

			for (ProjectTask project : tasks) {
				TaskListResponse tas = new TaskListResponse();

				tas.setTaskName(project.getTaskName());
				tas.setTaskSequence(project.getProjectSequence());
				tas.setPriority(project.getPriority());
				tas.setStatus(project.getStatus());
				tas.setAssignee(project.getAssignee());
				tas.setAssigneeName(assigneeNames.get(project.getAssignee()));
				tas.setDueDate(formatDueDate(project.getDueDate()));
				tas.setCreatedOn(project.getCreatedAt());
				tas.setUpdatedOn(project.getUpdatedAt());
				tas.setSubtask(project.isSubtask());
				tas.setParentTaskId(project.getParentTaskId());
				tas.setSubtaskCount(subtaskCounts.getOrDefault(project.getProjectSequence(), 0));

				taskLists.add(tas);
			}

			return taskLists;
		}

		throw new TaskIdNotFoundException("Task not found");

	}

	public List<SubtaskList> getSubTaskList(String parentId) {

		List<Object> subtaskList = projectTaskRepo.findSubtaskListByParentId(parentId);
		List<SubtaskList> subtaskLists = new ArrayList<>();

		Set<String> assigneeIds = new HashSet<>();
		for (Object subtask : subtaskList) {
			Object assignee = ((Object[]) subtask)[5];
			if (assignee != null) {
				assigneeIds.add(String.valueOf(assignee));
			}
		}

		Map<String, String> assigneeNames = new HashMap<>();
		for (Users user : userRepo.findByUserIdIn(assigneeIds)) {
			assigneeNames.put(user.getUserId(), user.getName());
		}

		Iterator itr = subtaskList.iterator();

		while (itr.hasNext()) {
			Object[] row = (Object[]) itr.next();
			SubtaskList sub = new SubtaskList();

			sub.setTaskName(String.valueOf(row[0]));
			sub.setTaskType(String.valueOf(row[1]));
			sub.setTaskSequence(String.valueOf(row[2]));
			sub.setPriority(String.valueOf(row[3]));
			sub.setStatus(String.valueOf(row[4]));
			// The assignee's name, "NA" when nobody is assigned – same as the task details
			sub.setAssignee(assigneeNames.getOrDefault(String.valueOf(row[5]), "NA"));

			subtaskLists.add(sub);

		}

		return subtaskLists;
	}

	public TaskDetails getTaskDetails(String taskSequence) {

		ProjectTask task = projectTaskRepo.findByProjectSequence(taskSequence);
		if (task != null) {

			TaskDetails getTask = new TaskDetails();
			Users user = userRepo.findByUserId(task.getAssignee());

			getTask.setSubtask(task.isSubtask());
			getTask.setParentTaskId(task.getParentTaskId());
			getTask.setDueDate(formatDueDate(task.getDueDate()));

			if (user == null) {
				getTask.setTaskName(task.getTaskName());
				getTask.setTaskDesc(task.getTaskDesc());
				getTask.setTaskSequence(task.getProjectSequence());
				getTask.setPriority(task.getPriority());
				getTask.setStatus(task.getStatus());
				getTask.setCreatedOn(task.getCreatedAt());
				getTask.setUpdatedOn(task.getUpdatedAt());
				getTask.setAssignee("NA");

			} else {
				getTask.setTaskName(task.getTaskName());
				getTask.setTaskDesc(task.getTaskDesc());
				getTask.setTaskSequence(task.getProjectSequence());
				getTask.setPriority(task.getPriority());
				getTask.setStatus(task.getStatus());
				getTask.setCreatedOn(task.getCreatedAt());
				getTask.setUpdatedOn(task.getUpdatedAt());
				getTask.setAssignee(user.getName());
			}

			return getTask;
		}

		throw new TaskIdNotFoundException("Task sequence not found");
	}

	@Transactional
	public String updateTask(UpdateProjectTaskRequest updateTask) {

		ProjectTask task = projectTaskRepo.findByProjectSequence(updateTask.getTaskId());
		Users user = userRepo.findByEmail(updateTask.getAssignee());

		if (task != null) {

			recordChanges(task, updateTask, user);

			if(user != null) {
				task.setAssignee(user.getUserId());
			}
			task.setPriority(updateTask.getPriority());
			task.setTaskDesc(updateTask.getDescription());
			task.setStatus(updateTask.getStatus());

			projectTaskRepo.save(task);
			return "Task updated successfully";

		}

		throw new TaskIdNotFoundException("Task id not found");
	}

	// Callers send the whole task, so this only records the fields that really differ
	private void recordChanges(ProjectTask task, UpdateProjectTaskRequest update, Users newAssignee) {

		if (!Objects.equals(task.getStatus(), update.getStatus())) {
			activityService.recordTaskActivity(ActivityType.STATUS_CHANGED, task, task.getStatus(), update.getStatus());
		}
		if (!Objects.equals(task.getPriority(), update.getPriority())) {
			activityService.recordTaskActivity(ActivityType.PRIORITY_CHANGED, task, task.getPriority(), update.getPriority());
		}
		if (newAssignee != null && !newAssignee.getUserId().equals(task.getAssignee())) {
			Users oldAssignee = userRepo.findByUserId(task.getAssignee());
			activityService.recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, task,
					oldAssignee != null ? oldAssignee.getName() : null, newAssignee.getName());
		}
		// Null and empty both mean no description. The text itself is not recorded.
		if (!Objects.equals(emptyToNull(task.getTaskDesc()), emptyToNull(update.getDescription()))) {
			activityService.recordTaskActivity(ActivityType.DESCRIPTION_CHANGED, task, null, null);
		}
	}

	private String emptyToNull(String value) {
		return value == null || value.isEmpty() ? null : value;
	}

	@Transactional
	public String updateDueDate(UpdateDueDateRequest request) {

		LocalDate dueDate = parseDueDate(request.getDueDate());
		ProjectTask task = projectTaskRepo.findByProjectSequence(request.getTaskId());

		if (task != null) {

			if (!Objects.equals(task.getDueDate(), dueDate)) {
				activityService.recordTaskActivity(ActivityType.DUE_DATE_CHANGED, task,
						formatDueDate(task.getDueDate()), formatDueDate(dueDate));
			}

			task.setDueDate(dueDate);

			projectTaskRepo.save(task);
			return dueDate != null ? "Due date updated" : "Due date removed";

		}

		throw new TaskIdNotFoundException("Task id not found");
	}

	private LocalDate parseDueDate(String value) {

		if (value == null || value.isBlank()) {
			return null;
		}

		try {
			LocalDate dueDate = LocalDate.parse(value);

			// A date input passes through years like 0002 while the user is still typing
			if (dueDate.getYear() < MIN_DUE_YEAR || dueDate.getYear() > MAX_DUE_YEAR) {
				throw new BadRequestException("Invalid due date");
			}

			return dueDate;
		} catch (DateTimeParseException e) {
			throw new BadRequestException("Invalid due date");
		}
	}

	private String formatDueDate(LocalDate dueDate) {
		return dueDate != null ? dueDate.toString() : null;
	}

	@Transactional
	public String createSubtask(RequestCreateSubtask subtaskRequest) {

		ProjectTask parent = projectTaskRepo.findByProjectSequence(subtaskRequest.getParentTaskId());

		if (parent == null) {
			throw new TaskIdNotFoundException("Parent task not found");
		}

		if (parent.isSubtask()) {
			throw new BadRequestException("A subtask can't have its own subtasks");
		}

		LocalDate dueDate = parseDueDate(subtaskRequest.getDueDate());

		try {
			Backlog back = backlogRepo.findByProjectIdentifier(subtaskRequest.getProjectId());

			ProjectTask projTask = new ProjectTask();
			projTask.setBacklog(back);

			Integer backlogSequesnce = back.getPTSequence();
			backlogSequesnce++;
			back.setPTSequence(backlogSequesnce);

			projTask.setProjectSequence(subtaskRequest.getProjectId() + "-" + backlogSequesnce);
			projTask.setProjectIdentifier(subtaskRequest.getProjectId());

			if (subtaskRequest.getPriority() == "" || subtaskRequest.getPriority() == null) {
				projTask.setPriority("LOW");
			}
			if (subtaskRequest.getStatus() == "" || subtaskRequest.getStatus() == null) {
				projTask.setStatus("TODO");
			}

			projTask.setPriority(subtaskRequest.getPriority());
			projTask.setTaskName(subtaskRequest.getTaskName());
			;
			// projTask.setSprintId(request.getSprintId());
			projTask.setSubtask(true);
			projTask.setTaskType("Task");
			projTask.setParentTaskId(subtaskRequest.getParentTaskId());
			projTask.setDueDate(dueDate);

			projectTaskRepo.save(projTask);
			activityService.recordTaskActivity(ActivityType.SUBTASK_CREATED, projTask, null, subtaskRequest.getParentTaskId());

			return "SubTask created successfully";
		} catch (Exception e) {
			throw new ProjectNotFoundException("Project not found");
		}

	}
	
	public List<TaskListResponse> getTaskListsByAssignee(String email) {
		
		Users user = userRepo.findByEmail(email);
		List<Object> tasks = projectTaskRepo.getTaskListsByAssignee(user.getUserId());
		Iterator it = tasks.iterator();
		List<TaskListResponse> taskLists = new ArrayList<>();
		while(it.hasNext()) {
			Object[] row = (Object[]) it.next();
			TaskListResponse task = new TaskListResponse();
			
			task.setTaskName(String.valueOf(row[0]));
			task.setTaskType(String.valueOf(row[1]));
			task.setTaskSequence(String.valueOf(row[2]));
			task.setPriority(String.valueOf(row[3]));
			task.setStatus(String.valueOf(row[4]));
			task.setAssignee(String.valueOf(row[5]));
			task.setSubtask((Boolean) row[6]);
			task.setParentTaskId((String) row[7]);
			task.setSubtaskCount(projectTaskRepo.getTotalSubtasks(task.getTaskSequence()));
			
			taskLists.add(task);
		}
		
		return taskLists;
	}
	
	public StatisticsResponse getStatisticInfo(String taskId) {

		Integer total = projectTaskRepo.getTotalSubtasks(taskId);
		Integer completed = projectTaskRepo.getCompletedSubtasks(taskId);
		Integer inProgress = projectTaskRepo.getInProgressSubtasks(taskId);
		Integer pending = projectTaskRepo.getPendingSubtasks(taskId);
		
		Integer completedTasks = 0;
		Integer pendingTasks = 0;
		Integer inprogressTask = 0;

		if (completed != 0) {
			completedTasks = completed * 100 / total;
		}
		if (inProgress != 0) {
			inprogressTask = inProgress * 100 / total;
		}
		if (pending != 0) {
			pendingTasks = pending * 100 / total;
		}
		
		StatisticsResponse stats = new StatisticsResponse();

		stats.setCompleted(completedTasks);
		stats.setInprogress(inprogressTask);
		stats.setPending(pendingTasks);

		return stats;
	}
	
	public HomeTaskCounts getHomeStatsData(String proj) {

		ProjectEntity project = projRepo.findByProjectId(proj);
		HomeTaskCounts count = new HomeTaskCounts();
		if (project != null) {
			Backlog back = backlogRepo.findByProjectIdentifier(project.getProjectIdentifier());

			Integer total = projectTaskRepo.getTotalTaskByProject(back.getId().intValue());
			Integer completed = projectTaskRepo.getCompletedTaskByProject(back.getId().intValue());
			Integer inProgress = projectTaskRepo.getInProgressTaskByProject(back.getId().intValue());
			Integer pending = projectTaskRepo.getPendingTaskByProject(back.getId().intValue());

			count.setTotal(total);
			count.setCompleted(completed);
			count.setInprogress(inProgress);
			count.setPending(pending);
		}

		return count;
	}

}
