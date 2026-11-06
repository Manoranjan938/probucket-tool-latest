package com.tool.ProjectTool.controller;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.request.ProjectTaskRequest;
import com.tool.ProjectTool.model.request.RequestCreateSubtask;
import com.tool.ProjectTool.model.request.UpdateAssigneeRequest;
import com.tool.ProjectTool.model.request.UpdateBugDetailsRequest;
import com.tool.ProjectTool.model.request.UpdateDueDateRequest;
import com.tool.ProjectTool.model.request.UpdateEstimateRequest;
import com.tool.ProjectTool.model.request.UpdateLabelsRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
import com.tool.ProjectTool.model.request.UpdateStartDateRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.HomeTaskCounts;
import com.tool.ProjectTool.model.response.StatisticsResponse;
import com.tool.ProjectTool.model.response.SubtaskList;
import com.tool.ProjectTool.model.response.TaskDetails;
import com.tool.ProjectTool.model.response.TaskListResponse;
import com.tool.ProjectTool.service.ProjectTaskService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/task")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class TaskController {

	@Autowired
	private ProjectTaskService taskService;

	@Autowired
	private ValidationErrorService errorService;

	@PostMapping("/createTask")
	public ResponseEntity<?> createProjectTask(@Valid @RequestBody ProjectTaskRequest taskRequest,
			BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		String taskSequence = taskService.addProjectTask(taskRequest);

		return ApiResponseBuilder.created("Task created successfully", Map.of("taskSequence", taskSequence));
	}

	@GetMapping("/getTasks/{backlog_id}")
	public ResponseEntity<ApiResponse<List<TaskListResponse>>> getTaskLists(@PathVariable("backlog_id") String id) {

		return ApiResponseBuilder.ok(taskService.getTaskLists(id));
	}

	@GetMapping("/getTaskDetails/{project_sequence}")
	public ResponseEntity<?> getTaskDetails(@PathVariable("project_sequence") String taskSeaquenceId) {

		return ApiResponseBuilder.ok(taskService.getTaskDetails(taskSeaquenceId));
	}

	@PostMapping("/updateTask")
	public ResponseEntity<?> updateProjectTask(@Valid @RequestBody UpdateProjectTaskRequest updateTask,
			BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateTask(updateTask));
	}
	
	@PostMapping("/updateBugDetails")
	public ResponseEntity<?> updateBugDetails(@Valid @RequestBody UpdateBugDetailsRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateBugDetails(request));
	}

	@PostMapping("/updateDueDate")
	public ResponseEntity<?> updateDueDate(@RequestBody UpdateDueDateRequest request) {

		return ApiResponseBuilder.ok(taskService.updateDueDate(request));
	}
	
	@PostMapping("/updateAssignee")
	public ResponseEntity<?> updateAssignee(@Valid @RequestBody UpdateAssigneeRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateAssignee(request));
	}

	@PostMapping("/updateStartDate")
	public ResponseEntity<?> updateStartDate(@Valid @RequestBody UpdateStartDateRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateStartDate(request));
	}

	@PostMapping("/updateEstimate")
	public ResponseEntity<?> updateEstimate(@Valid @RequestBody UpdateEstimateRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateEstimate(request));
	}

	@PostMapping("/updateLabels")
	public ResponseEntity<?> updateLabels(@Valid @RequestBody UpdateLabelsRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(taskService.updateLabels(request));
	}

	@GetMapping("/getLabels/{projectIdentifier}")
	public ResponseEntity<ApiResponse<List<String>>> getProjectLabels(@PathVariable("projectIdentifier") String projectIdentifier) {
		return ApiResponseBuilder.ok(taskService.getProjectLabels(projectIdentifier));
	}

	@PostMapping("/createSubTask")
	public ResponseEntity<?> createSubTask(@RequestBody RequestCreateSubtask subtaskRequest){
		
		return ApiResponseBuilder.created(taskService.createSubtask(subtaskRequest));
	}
	
	@GetMapping("/getSubtaskList/{parentId}")
	public ResponseEntity<ApiResponse<List<SubtaskList>>> getSubtaskList(@PathVariable("parentId") String parentId){
		
		return ApiResponseBuilder.ok(taskService.getSubTaskList(parentId));
	}
	
	@GetMapping("/getTasksByAssignee/{assigneeEmail}")
	@PreAuthorize("#email == principal.email")
	public ResponseEntity<ApiResponse<List<TaskListResponse>>> getTaskListsByAssignee(@PathVariable("assigneeEmail") String email){
		
		return ApiResponseBuilder.ok(taskService.getTaskListsByAssignee(email));
	}
	
	@GetMapping("/getStatistics/{taskId}")
	public ResponseEntity<ApiResponse<StatisticsResponse>> getTaskStatistics(@PathVariable("taskId") String id){
		
		return ApiResponseBuilder.ok(taskService.getStatisticInfo(id));
	}
	
	@GetMapping("/getHomeTaskCounts/{projectid}")
	public ResponseEntity<ApiResponse<HomeTaskCounts>> getHomeTaskCounts(@PathVariable("projectid") String projectId){
		
		return ApiResponseBuilder.ok(taskService.getHomeStatsData(projectId));
	}

}
