package com.tool.ProjectTool.controller;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.entity.ActivityType;
import com.tool.ProjectTool.model.response.ActivityPageResponse;
import com.tool.ProjectTool.model.response.ActivityPersonResponse;
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

	// The Activity page: older entries a page at a time, with optional filters. types is comma separated;
	// from and to are ISO instants, from inclusive and to exclusive.
	@GetMapping("/getProjectActivityLog/{projectIdentifier}")
	public ResponseEntity<ApiResponse<ActivityPageResponse>> getProjectActivityLog(
			@PathVariable("projectIdentifier") String projectIdentifier,
			@RequestParam(name = "before", required = false) Long before,
			@RequestParam(name = "actorId", required = false) String actorId,
			@RequestParam(name = "types", required = false) List<ActivityType> types,
			@RequestParam(name = "from", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
			@RequestParam(name = "to", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to) {

		return ApiResponseBuilder
				.ok(activityService.getProjectActivityLog(projectIdentifier, before, actorId, types, from, to));
	}

	@GetMapping("/getProjectActivityPeople/{projectIdentifier}")
	public ResponseEntity<ApiResponse<List<ActivityPersonResponse>>> getProjectActivityPeople(
			@PathVariable("projectIdentifier") String projectIdentifier) {

		return ApiResponseBuilder.ok(activityService.getProjectActivityPeople(projectIdentifier));
	}

	@GetMapping("/getTaskActivity/{taskSequence}")
	public ResponseEntity<ApiResponse<List<ActivityResponse>>> getTaskActivity(
			@PathVariable("taskSequence") String taskSequence) {

		return ApiResponseBuilder.ok(activityService.getTaskActivity(taskSequence));
	}

}
