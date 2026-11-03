package com.tool.ProjectTool.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.response.ActivityResponse;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.service.ActivityService;

@RestController
@RequestMapping("/api/v1/activity")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class ActivityController {

	@Autowired
	private ActivityService activityService;

	@GetMapping("/getProjectActivity/{projectIdentifier}")
	public ResponseEntity<ApiResponse<List<ActivityResponse>>> getProjectActivity(
			@PathVariable("projectIdentifier") String projectIdentifier) {

		return ApiResponseBuilder.ok(activityService.getProjectActivity(projectIdentifier));
	}

	@GetMapping("/getTaskActivity/{taskSequence}")
	public ResponseEntity<ApiResponse<List<ActivityResponse>>> getTaskActivity(
			@PathVariable("taskSequence") String taskSequence) {

		return ApiResponseBuilder.ok(activityService.getTaskActivity(taskSequence));
	}

}
