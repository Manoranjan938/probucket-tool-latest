package com.tool.ProjectTool.service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
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
import com.tool.ProjectTool.model.request.UpdateAssigneeRequest;
import com.tool.ProjectTool.model.request.UpdateBugDetailsRequest;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateEstimateRequest;
import com.tool.ProjectTool.model.request.UpdateLabelsRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
import com.tool.ProjectTool.model.request.UpdateStartDateRequest;
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

	public static final String TASK = "TASK";
	public static final String BUG = "BUG";
	private static final Set<String> SEVERITIES = Set.of("MINOR", "MAJOR", "CRITICAL");
	private static final Set<Integer> STORY_POINTS = Set.of(1, 2, 3, 5, 8, 13);
	public static final int MAX_LABELS = 5;
	public static final int MAX_LABEL_LENGTH = 30;
	private static final String START_AFTER_DUE = "The start date can't be after the due date";

	@Transactional
	public String addProjectTask(ProjectTaskRequest request) {

		LocalDate dueDate = parseDueDate(request.getDueDate());
		LocalDate startDate = parseDate(request.getStartDate(), "Invalid start date");
		checkDates(startDate, dueDate, START_AFTER_DUE);
		Integer storyPoints = checkStoryPoints(request.getStoryPoints());
		List<String> labels = normaliseLabels(request.getProjectIdentifier(), request.getLabels());
		// Looked up before the try below, which reports every failure as a missing project
		Users assignee = null;
		if (request.getAssignee() != null && !request.getAssignee().isBlank()) {
			assignee = userRepo.findByEmail(request.getAssignee());
			if (assignee == null) {
				throw new BadRequestException("The person to assign was not found");
			}
		}
		Backlog back = backlogRepo.findByProjectIdentifier(request.getProjectIdentifier());
		if (back == null) {
			throw new ProjectNotFoundException("Project not found");
		}
		String taskType = resolveTaskType(back.getProject(), request.getTaskType());
		boolean bug = BUG.equals(taskType);
		String severity = bug ? checkSeverity(request.getSeverity()) : null;

		try {
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
			projTask.setStartDate(startDate);
			projTask.setStoryPoints(storyPoints);
			projTask.setLabels(labels);
			projTask.setSubtask(false);
			projTask.setTaskDesc(trimToNull(request.getDescription()));
			projTask.setTaskType(taskType);
			if (bug) {
				projTask.setStepsToReproduce(trimToNull(request.getStepsToReproduce()));
				projTask.setExpectedResult(trimToNull(request.getExpectedResult()));
				projTask.setActualResult(trimToNull(request.getActualResult()));
				projTask.setSeverity(severity);
			}
			if (assignee != null) {
				projTask.setAssignee(assignee.getUserId());
			}

			projectTaskRepo.save(projTask);
			activityService.recordTaskActivity(ActivityType.TASK_CREATED, projTask, null, null);
			if (assignee != null) {
				activityService.recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, projTask, null, assignee.getName());
			}

			// The key of the new task, e.g. for uploading its images next
			return projTask.getProjectSequence();
		} catch (Exception e) {
			throw new ProjectNotFoundException("Project not found");
		}
	}

	// What a project takes follows the template chosen when it was created: "bug" only bugs,
	// "project and bug" both, anything else (incl. older projects) only tasks. Empty means the project's default.
	private String resolveTaskType(ProjectEntity project, String requested) {
		String template = project != null ? project.getProjectTemplateType() : null;
		boolean bugsOnly = "bug".equals(template);
		boolean takesBugs = bugsOnly || "project and bug".equals(template);

		String type = requested == null || requested.isBlank() ? (bugsOnly ? BUG : TASK) : requested;
		if (!TASK.equals(type) && !BUG.equals(type)) {
			throw new BadRequestException("Unknown task type");
		}
		if (BUG.equals(type) && !takesBugs) {
			throw new BadRequestException("This project doesn't track bugs");
		}
		if (TASK.equals(type) && bugsOnly) {
			throw new BadRequestException("This project only tracks bugs");
		}
		return type;
	}

	private String checkSeverity(String severity) {
		String value = emptyToNull(severity);
		if (value != null && !SEVERITIES.contains(value)) {
			throw new BadRequestException("Unknown severity");
		}
		return value;
	}

	private Integer checkStoryPoints(Integer points) {
		if (points != null && !STORY_POINTS.contains(points)) {
			throw new BadRequestException("Story points must be 1, 2, 3, 5, 8 or 13");
		}
		return points;
	}

	private void checkDates(LocalDate startDate, LocalDate dueDate, String message) {
		if (startDate != null && dueDate != null && startDate.isAfter(dueDate)) {
			throw new BadRequestException(message);
		}
	}

	// Trimmed, inner spaces collapsed, empty ones dropped and duplicates merged ignoring case.
	// A label the project already uses keeps the project's spelling, so "UI" and "ui" stay one label.
	private List<String> normaliseLabels(String projectIdentifier, List<String> requested) {
		if (requested == null || requested.isEmpty()) {
			return new ArrayList<>();
		}

		Map<String, String> spellings = new HashMap<>();
		for (String existing : projectTaskRepo.findLabelsByProjectIdentifier(projectIdentifier)) {
			spellings.putIfAbsent(existing.toLowerCase(Locale.ROOT), existing);
		}

		Map<String, String> labels = new LinkedHashMap<>();
		for (String raw : requested) {
			String label = raw == null ? "" : raw.trim().replaceAll("\\s+", " ");
			if (label.isEmpty()) {
				continue;
			}
			if (label.length() > MAX_LABEL_LENGTH) {
				throw new BadRequestException("A label can be at most " + MAX_LABEL_LENGTH + " characters");
			}
			String key = label.toLowerCase(Locale.ROOT);
			labels.putIfAbsent(key, spellings.getOrDefault(key, label));
		}
		if (labels.size() > MAX_LABELS) {
			throw new BadRequestException("A task can have at most " + MAX_LABELS + " labels");
		}
		return new ArrayList<>(labels.values());
	}

	// The labels used anywhere in the project, offered as suggestions
	public List<String> getProjectLabels(String projectIdentifier) {
		List<String> labels = new ArrayList<>(projectTaskRepo.findLabelsByProjectIdentifier(projectIdentifier));
		labels.sort(String.CASE_INSENSITIVE_ORDER);
		return labels;
	}

	private String trimToNull(String value) {
		return emptyToNull(value == null ? null : value.trim());
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
			Map<String, String> assigneeEmails = new HashMap<>();
			for (Users user : userRepo.findByUserIdIn(assigneeIds)) {
				assigneeNames.put(user.getUserId(), user.getName());
				assigneeEmails.put(user.getUserId(), user.getEmail());
			}

			for (ProjectTask project : tasks) {
				TaskListResponse tas = new TaskListResponse();

				tas.setTaskName(project.getTaskName());
				tas.setTaskSequence(project.getProjectSequence());
				tas.setPriority(project.getPriority());
				tas.setStatus(project.getStatus());
				tas.setAssignee(project.getAssignee());
				tas.setAssigneeName(assigneeNames.get(project.getAssignee()));
				tas.setAssigneeEmail(assigneeEmails.get(project.getAssignee()));
				tas.setDueDate(formatDueDate(project.getDueDate()));
				tas.setCreatedOn(project.getCreatedAt());
				tas.setUpdatedOn(project.getUpdatedAt());
				tas.setSubtask(project.isSubtask());
				tas.setTaskType(project.getTaskType());
				tas.setStoryPoints(project.getStoryPoints());
				tas.setStartDate(formatDueDate(project.getStartDate()));
				tas.setLabels(new ArrayList<>(project.getLabels()));
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
			getTask.setTaskType(task.getTaskType());
			getTask.setStepsToReproduce(task.getStepsToReproduce());
			getTask.setExpectedResult(task.getExpectedResult());
			getTask.setActualResult(task.getActualResult());
			getTask.setSeverity(task.getSeverity());
			getTask.setStoryPoints(task.getStoryPoints());
			getTask.setStartDate(formatDueDate(task.getStartDate()));
			getTask.setLabels(new ArrayList<>(task.getLabels()));

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
				getTask.setAssigneeEmail(user.getEmail());
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

			// Nobody can work on a task without an owner, so its status stays put until someone is assigned.
			// Assigning and changing the status in the same request is fine.
			String assignee = user != null ? user.getUserId() : task.getAssignee();
			boolean statusChanges = !Objects.equals(task.getStatus(), updateTask.getStatus());
			if (statusChanges && (assignee == null || assignee.isBlank())) {
				throw new BadRequestException("Assign the task to someone before changing its status");
			}

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

	// The changes and their history rows share a transaction
	@Transactional
	public String updateBugDetails(UpdateBugDetailsRequest request) {

		ProjectTask task = projectTaskRepo.findByProjectSequence(request.getTaskId());
		if (task == null) {
			throw new TaskIdNotFoundException("Task id not found");
		}
		if (!BUG.equals(task.getTaskType())) {
			throw new BadRequestException("Only a bug has bug details");
		}

		String severity = checkSeverity(request.getSeverity());
		String steps = trimToNull(request.getStepsToReproduce());
		String expected = trimToNull(request.getExpectedResult());
		String actual = trimToNull(request.getActualResult());

		if (!Objects.equals(task.getSeverity(), severity)) {
			activityService.recordTaskActivity(ActivityType.SEVERITY_CHANGED, task, task.getSeverity(), severity);
		}
		// Like the description, the texts themselves are not recorded
		if (!Objects.equals(task.getStepsToReproduce(), steps) || !Objects.equals(task.getExpectedResult(), expected)
				|| !Objects.equals(task.getActualResult(), actual)) {
			activityService.recordTaskActivity(ActivityType.BUG_DETAILS_CHANGED, task, null, null);
		}

		task.setSeverity(severity);
		task.setStepsToReproduce(steps);
		task.setExpectedResult(expected);
		task.setActualResult(actual);
		projectTaskRepo.save(task);
		return "Bug details updated";
	}

	@Transactional
	public String updateDueDate(UpdateDueDateRequest request) {

		LocalDate dueDate = parseDueDate(request.getDueDate());
		ProjectTask task = projectTaskRepo.findByProjectSequence(request.getTaskId());

		if (task != null) {

			checkDates(task.getStartDate(), dueDate, "The due date can't be before the start date");

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

	// Assigns the task to someone, or unassigns it. Its status stays as it is; an unassigned task just can't move until
	// someone is assigned again. Kept apart from updateTask, whose callers send the assignee's name and rely on it being ignored.
	@Transactional
	public String updateAssignee(UpdateAssigneeRequest request) {

		ProjectTask task = findTask(request.getTaskId());
		Users assignee = null;
		if (request.getAssignee() != null && !request.getAssignee().isBlank()) {
			assignee = userRepo.findByEmail(request.getAssignee());
			if (assignee == null) {
				throw new BadRequestException("The person to assign was not found");
			}
		}

		String newId = assignee != null ? assignee.getUserId() : null;
		if (Objects.equals(emptyToNull(task.getAssignee()), newId)) {
			return assignee != null ? "Assignee updated" : "Task unassigned";
		}

		Users oldAssignee = task.getAssignee() != null ? userRepo.findByUserId(task.getAssignee()) : null;
		activityService.recordTaskActivity(ActivityType.ASSIGNEE_CHANGED, task,
				oldAssignee != null ? oldAssignee.getName() : null, assignee != null ? assignee.getName() : null);
		task.setAssignee(newId);
		projectTaskRepo.save(task);
		return assignee != null ? "Assignee updated" : "Task unassigned";
	}

	@Transactional
	public String updateStartDate(UpdateStartDateRequest request) {

		LocalDate startDate = parseDate(request.getStartDate(), "Invalid start date");
		ProjectTask task = findTask(request.getTaskId());
		checkDates(startDate, task.getDueDate(), START_AFTER_DUE);

		if (!Objects.equals(task.getStartDate(), startDate)) {
			activityService.recordTaskActivity(ActivityType.START_DATE_CHANGED, task,
					formatDueDate(task.getStartDate()), formatDueDate(startDate));
		}
		task.setStartDate(startDate);
		projectTaskRepo.save(task);
		return startDate != null ? "Start date updated" : "Start date removed";
	}

	@Transactional
	public String updateEstimate(UpdateEstimateRequest request) {

		Integer storyPoints = checkStoryPoints(request.getStoryPoints());
		ProjectTask task = findTask(request.getTaskId());

		if (!Objects.equals(task.getStoryPoints(), storyPoints)) {
			activityService.recordTaskActivity(ActivityType.ESTIMATE_CHANGED, task,
					Objects.toString(task.getStoryPoints(), null), Objects.toString(storyPoints, null));
		}
		task.setStoryPoints(storyPoints);
		projectTaskRepo.save(task);
		return storyPoints != null ? "Estimate updated" : "Estimate removed";
	}

	// One history row per label added or removed
	@Transactional
	public String updateLabels(UpdateLabelsRequest request) {

		ProjectTask task = findTask(request.getTaskId());
		List<String> labels = normaliseLabels(task.getProjectIdentifier(), request.getLabels());

		for (String label : task.getLabels()) {
			if (!labels.contains(label)) {
				activityService.recordTaskActivity(ActivityType.LABEL_REMOVED, task, label, null);
			}
		}
		for (String label : labels) {
			if (!task.getLabels().contains(label)) {
				activityService.recordTaskActivity(ActivityType.LABEL_ADDED, task, null, label);
			}
		}
		task.setLabels(labels);
		projectTaskRepo.save(task);
		return "Labels updated";
	}

	private ProjectTask findTask(String taskId) {
		ProjectTask task = projectTaskRepo.findByProjectSequence(taskId);
		if (task == null) {
			throw new TaskIdNotFoundException("Task id not found");
		}
		return task;
	}

	private LocalDate parseDueDate(String value) {
		return parseDate(value, "Invalid due date");
	}

	private LocalDate parseDate(String value, String invalid) {

		if (value == null || value.isBlank()) {
			return null;
		}

		try {
			LocalDate date = LocalDate.parse(value);

			// A date input passes through years like 0002 while the user is still typing
			if (date.getYear() < MIN_DUE_YEAR || date.getYear() > MAX_DUE_YEAR) {
				throw new BadRequestException(invalid);
			}

			return date;
		} catch (DateTimeParseException e) {
			throw new BadRequestException(invalid);
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
			// Subtasks are pieces of work, even under a bug
			projTask.setTaskType(TASK);
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
