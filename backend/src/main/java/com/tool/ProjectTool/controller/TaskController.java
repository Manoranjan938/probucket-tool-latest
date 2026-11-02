package com.tool.ProjectTool.controller;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
import com.tool.ProjectTool.model.request.UpdateProjectTaskRequest;
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
@CrossOrigin({ "${app.cors.allowed-origin}" })
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

		String message = taskService.addProjectTask(taskRequest);

		return ApiResponseBuilder.created(message);
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
	public ResponseEntity<?> updateProjectTask(@RequestBody UpdateProjectTaskRequest updateTask) {

		return ApiResponseBuilder.ok(taskService.updateTask(updateTask));
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
