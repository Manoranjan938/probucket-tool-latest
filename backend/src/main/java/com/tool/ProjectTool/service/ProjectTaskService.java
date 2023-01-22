package com.tool.ProjectTool.service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.ProjectTask;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.exception.TaskIdNotFoundException;
import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
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

	@Autowired
	private BacklogRepository backlogRepo;

	@Autowired
	private ProjectTaskRepository projectTaskRepo;

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private ProjectRepository projRepo;

	public String addProjectTask(ProjectTaskRequest request) {

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
			projTask.setSubtask(false);

			projectTaskRepo.save(projTask);

			return "Task created successfully";
		} catch (Exception e) {
			throw new ProjectNotFoundException("Project not found");
		}
	}

	public List<TaskListResponse> getTaskLists(String backlogId) {

		List<ProjectTask> tasks = projectTaskRepo.findByProjectIdentifierOrderByPriority(backlogId);
		if (!tasks.isEmpty()) {
			List<TaskListResponse> taskLists = new ArrayList<>();
			for (ProjectTask project : tasks) {
				TaskListResponse tas = new TaskListResponse();

				tas.setTaskName(project.getTaskName());
				tas.setTaskSequence(project.getProjectSequence());
				tas.setPriority(project.getPriority());
				tas.setStatus(project.getStatus());

				taskLists.add(tas);
			}

			return taskLists;
		}

		throw new TaskIdNotFoundException("Task not found");

	}

	public List<SubtaskList> getSubTaskList(String parentId) {

		List<Object> subtaskList = projectTaskRepo.findSubtaskListByParentId(parentId);
		List<SubtaskList> subtaskLists = new ArrayList<>();
		Iterator itr = subtaskList.iterator();

		while (itr.hasNext()) {
			Object[] row = (Object[]) itr.next();
			SubtaskList sub = new SubtaskList();

			sub.setTaskName(String.valueOf(row[0]));
			sub.setTaskType(String.valueOf(row[1]));
			sub.setTaskSequence(String.valueOf(row[2]));
			sub.setPriority(String.valueOf(row[3]));
			sub.setStatus(String.valueOf(row[4]));
			sub.setAssignee(String.valueOf(row[5]));

			subtaskLists.add(sub);

		}

		return subtaskLists;
	}

	public TaskDetails getTaskDetails(String taskSequence) {

		ProjectTask task = projectTaskRepo.findByProjectSequence(taskSequence);
		if (task != null) {

			TaskDetails getTask = new TaskDetails();
			Users user = userRepo.findByUserId(task.getAssignee());

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

	public String updateTask(UpdateProjectTaskRequest updateTask) {

		ProjectTask task = projectTaskRepo.findByProjectSequence(updateTask.getTaskId());
		Users user = userRepo.findByEmail(updateTask.getAssignee());

		if (task != null) {

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

	public String createSubtask(RequestCreateSubtask subtaskRequest) {

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

			projectTaskRepo.save(projTask);

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
