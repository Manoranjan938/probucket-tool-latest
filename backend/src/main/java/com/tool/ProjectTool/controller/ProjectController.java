package com.tool.ProjectTool.controller;

import java.util.List;

import javax.annotation.security.RolesAllowed;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.service.ProjectService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/project")
@CrossOrigin({ "https://localhost:3002" })
public class ProjectController {

	@Autowired
	private ProjectService projectService;

	@Autowired
	private ValidationErrorService errorService;

	@PostMapping("/createProject")
	@RolesAllowed({ "ROLE_USER", "ROLE_TEAM-ADMIN", "ROLE_PERSONAL" })
	public ResponseEntity<?> createNewProject(@Valid @RequestBody ProjectRequest request, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		String project = projectService.saveProject(request);

		return new ResponseEntity<String>(project, HttpStatus.CREATED);
	}

	@GetMapping("/getProjects/{userId}")
	@RolesAllowed({ "ROLE_USER", "ROLE_TEAM-ADMIN", "ROLE_PERSONAL", "ROLE_TEAM-DEVELOPER",
			"ROLE_TEAM-TESTER, ROLE_TEAM-TASK-MANAGER" })
	public ResponseEntity<List<ProjectResponse>> getAllProjects(@PathVariable("userId") String userId) {

		List<ProjectResponse> projects = projectService.getAllProjects(userId);

		return new ResponseEntity<List<ProjectResponse>>(projects, HttpStatus.OK);

	}

	@GetMapping("/getProjectDetails/{projectId}")
	// @RolesAllowed({"ROLE_TEAM-ADMIN","ROLE_PERSONAL", "ROLE_TEAM-DEVELOPER",
	// "ROLE_TEAM-TESTER, ROLE_TEAM-TASK-MANAGER"})
	public ResponseEntity<ProjectResponse> getProjectDetailss(@PathVariable("projectId") String projectId) {

		ProjectResponse project = projectService.getProjectById(projectId);

		return new ResponseEntity<ProjectResponse>(project, HttpStatus.OK);
	}

	@PutMapping("/updateProject")
	public ResponseEntity<?> updateProject(@Valid @RequestBody UpdateProjectRequest projRequest, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}
		String update = projectService.updateProject(projRequest);

		return new ResponseEntity<String>(update, HttpStatus.OK);
	}

	@PutMapping("/deleteProject/{projectId}/{userId}")
	public ResponseEntity<?> deleteProject(@PathVariable("projectId") String id,
			@PathVariable("userId") String userId) {

		String delete = projectService.deleteProject(id, userId);

		return new ResponseEntity<String>(delete, HttpStatus.OK);
	}

}
