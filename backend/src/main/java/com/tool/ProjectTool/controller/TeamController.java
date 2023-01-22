package com.tool.ProjectTool.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;
import com.tool.ProjectTool.service.TeamService;
import com.tool.ProjectTool.service.ValidationErrorService;

@RestController
@RequestMapping("/api/v1/team")
@CrossOrigin({ "https://localhost:3002" })
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

		String message = teamService.createNewTeamMember(teamMember);

		return new ResponseEntity<String>(message, HttpStatus.CREATED);
	}

	@GetMapping("/getTeamMembers/{projectId}")
	public ResponseEntity<List<TeamMembersList>> getTeamMemberList(@PathVariable("projectId") String projectId) {

		return new ResponseEntity<List<TeamMembersList>>(teamService.getTeamList(projectId), HttpStatus.OK);
	}

	@GetMapping("/getProjectsByTeam/{userId}")
	public ResponseEntity<List<ProjectResponse>> getProjectListByTeamMember(@PathVariable("userId") String projectId) {

		return new ResponseEntity<List<ProjectResponse>>(teamService.getAllProjects(projectId), HttpStatus.OK);
	}
	
	@PostMapping("/updateTeamMember")
	public ResponseEntity<?> updateTeamMember(@RequestBody UpdateTeamRequest teamReq){
		
		return new ResponseEntity<String>(teamService.updateTeamMember(teamReq), HttpStatus.OK);
	}
	

}
