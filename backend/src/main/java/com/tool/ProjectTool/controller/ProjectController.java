package com.tool.ProjectTool.controller;

import java.util.List;

import jakarta.annotation.security.RolesAllowed;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.request.ProjectRequest;
import com.tool.ProjectTool.model.request.UpdateProjectRequest;
import com.tool.ProjectTool.model.request.UpdateProjectTemplateRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.service.ProjectService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/project")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@Autowired
	private ValidationErrorService errorService;

	@PostMapping("/createProject")
	@PreAuthorize("#request.userId == principal.userId")
	@RolesAllowed({ "USER", "TEAM-ADMIN", "PERSONAL" })
	public ResponseEntity<?> createNewProject(@Valid @RequestBody ProjectRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		String project = projectService.saveProject(request);

		return ApiResponseBuilder.created(project);
	}

	@GetMapping("/getProjects/{userId}")
	@PreAuthorize("#userId == principal.userId")
	// TODO(boot-migration): the last entry is one string, not two roles, so neither of those roles is ever matched.
	@RolesAllowed({ "USER", "TEAM-ADMIN", "PERSONAL", "TEAM-DEVELOPER",
			"TEAM-TESTER, ROLE_TEAM-TASK-MANAGER" })
	public ResponseEntity<ApiResponse<List<ProjectResponse>>> getAllProjects(@PathVariable("userId") String userId) {

		List<ProjectResponse> projects = projectService.getAllProjects(userId);

		return ApiResponseBuilder.ok(projects);

	}

	@GetMapping("/getProjectDetails/{projectId}")
	// @RolesAllowed({"ROLE_TEAM-ADMIN","ROLE_PERSONAL", "ROLE_TEAM-DEVELOPER",
	// "ROLE_TEAM-TESTER, ROLE_TEAM-TASK-MANAGER"})
	public ResponseEntity<ApiResponse<ProjectResponse>> getProjectDetailss(@PathVariable("projectId") String projectId) {

		ProjectResponse project = projectService.getProjectById(projectId);

		return ApiResponseBuilder.ok(project);
	}

	// Lead only
	@PutMapping("/updateProject")
	public ResponseEntity<?> updateProject(@Valid @RequestBody UpdateProjectRequest projRequest, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}
		String update = projectService.updateProject(projRequest);

		return ApiResponseBuilder.ok(update);
	}

	// Lead only
	@PutMapping("/updateProjectTemplate")
	public ResponseEntity<?> updateProjectTemplate(@Valid @RequestBody UpdateProjectTemplateRequest request,
			BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		return ApiResponseBuilder.ok(projectService.updateProjectTemplate(request));
	}

	@PutMapping("/deleteProject/{projectId}/{userId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<?> deleteProject(@PathVariable("projectId") String id,
			@PathVariable("userId") String userId) {

		String delete = projectService.deleteProject(id, userId);

		return ApiResponseBuilder.ok(delete);
	}

	// Lead only; the project must be deleted
	@PutMapping("/restoreProject/{projectId}")
	public ResponseEntity<?> restoreProject(@PathVariable("projectId") String projectId) {

		return ApiResponseBuilder.ok(projectService.restoreProject(projectId));
	}

	// The Recently deleted list on the Projects page: only the lead's own
	@GetMapping("/getDeletedProjects/{userId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<?> getDeletedProjects(@PathVariable("userId") String userId) {

		return ApiResponseBuilder.ok(projectService.getDeletedProjects(userId));
	}

}
