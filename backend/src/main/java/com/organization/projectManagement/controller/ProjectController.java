package com.organization.projectManagement.controller;

import java.security.Principal;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.organization.projectManagement.model.request.ProjectRequest;
import com.organization.projectManagement.model.response.ProjectResponse;
import com.organization.projectManagement.service.ProjectService;
import com.organization.projectManagement.service.ValidationErrorService;

@RestController
@RequestMapping("/api/project")
@CrossOrigin("https://localhost:3002")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	
	@Autowired
	private ValidationErrorService errorService;
	
	@PostMapping("/createProject")
	public ResponseEntity<?> createNewProject(@Valid @RequestBody ProjectRequest request, BindingResult result, 
											Principal principal){
		
		ResponseEntity<?> errorMap = errorService.mapValidationError(result);
		if(errorMap != null) {
			return errorMap;
		}
		
		ProjectResponse project = projectService.saveOrUpdateProejct(request, principal.getName());
		
		return new ResponseEntity<ProjectResponse>(project, HttpStatus.CREATED);
	}
	
	@GetMapping("/getProjects")
	public ResponseEntity<?> getAllProjects(){
		
		return null;
		
	}
	
}
