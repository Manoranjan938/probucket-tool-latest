package com.tool.ProjectTool.controller;

import java.util.List;

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

import com.tool.ProjectTool.model.request.RequestTeamMember;
import com.tool.ProjectTool.model.request.UpdateTeamRequest;
import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;
import com.tool.ProjectTool.model.response.NewTeamMemberResponse;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;
import com.tool.ProjectTool.service.TeamService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/team")
@CrossOrigin(origins = "${app.cors.allowed-origin}", allowCredentials = "true")
public class TeamController {

	@Autowired
	private ValidationErrorService errorService;

	@Autowired
	private TeamService teamService;

	@PostMapping("/newTeamMember")
	public ResponseEntity<?> addNewTeamMember(@Valid @RequestBody RequestTeamMember teamMember, BindingResult result) {

		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if (errorMap != null) {
			return errorMap;
		}

		NewTeamMemberResponse member = teamService.createNewTeamMember(teamMember);

		return ApiResponseBuilder.created("New team member added successfully", member);
	}

	@GetMapping("/getTeamMembers/{projectId}")
	public ResponseEntity<ApiResponse<List<TeamMembersList>>> getTeamMemberList(@PathVariable("projectId") String projectId) {

		return ApiResponseBuilder.ok(teamService.getTeamList(projectId));
	}

	@GetMapping("/getProjectsByTeam/{userId}")
	@PreAuthorize("#userId == principal.userId")
	public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjectListByTeamMember(@PathVariable("userId") String userId) {

		return ApiResponseBuilder.ok(teamService.getAllProjects(userId));
	}
	
	@PostMapping("/updateTeamMember")
	public ResponseEntity<?> updateTeamMember(@RequestBody UpdateTeamRequest teamReq){
		
		return ApiResponseBuilder.ok(teamService.updateTeamMember(teamReq));
	}
	

}
