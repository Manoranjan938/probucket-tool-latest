package com.tool.ProjectTool.service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.Backlog;
import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.exception.UserNotFoundException;
import com.tool.ProjectTool.model.request.ProjectRequest;
import com.tool.ProjectTool.model.request.UpdateProjectRequest;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class ProjectService {

	@Autowired
	private ProjectRepository projectRepo;

	@Autowired
	private UserRepository userRepo;

	static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	static SecureRandom rnd = new SecureRandom();

	String randomString(int len) {
		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++)
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		return sb.toString();
	}

	static String firstLetterWord(String str) {
		String result = "";

		boolean v = true;
		for (int i = 0; i < str.length(); i++) {
			if (str.charAt(i) == ' ') {
				v = true;
			}

			else if (str.charAt(i) != ' ' && v == true) {
				result += (str.charAt(i));
				v = false;
			}
		}

		return result;
	}

	public String saveProject(ProjectRequest request) {

		int status = 1;
		String ids = randomString(20);
		String id = null;

		try {

			Users user = userRepo.findByUserId(request.getUserId());
			ProjectEntity checkId = projectRepo.findByProjectId(ids);

			ProjectEntity project = new ProjectEntity();
			Backlog backlog = new Backlog();

			project.setUser(user);
			project.setProjectLeader(user.getName());
			project.setProjectName(request.getProjectName());
			project.setProjectTeamType(request.getProjectType());
			project.setProjectTemplateType(request.getProjectTemplate());
			project.setProjectRole("Project Leader");

			if (request.getProjectType().equalsIgnoreCase("personal")) {
				user.setRoleName("ROLE_PERSONAL");
			}
			if (request.getProjectType().equalsIgnoreCase("team")) {
				user.setRoleName("ROLE_TEAM-ADMIN");
			}

			userRepo.save(user);

			String letters = firstLetterWord(request.getProjectName());

			project.setProjectIdentifier(letters.toUpperCase());
			project.setBacklog(backlog);
			backlog.setProject(project);
			backlog.setProjectIdentifier(project.getProjectIdentifier().toUpperCase());

			if (request.getProjectType().equalsIgnoreCase("personal")) {
				project.setProjectAccessType("Private");
			}

			if (checkId != null) {
				id = randomString(20);
			} else {
				id = ids;
			}

			project.setProjectId(id);
			project.setProjectDescription(request.getProjectDesc());
			project.setStatus(status);

			projectRepo.save(project);

			return "Project created";
		} catch (Exception e) {
			System.out.println(e);
			return null;
		}
	}

	public List<ProjectResponse> getAllProjects(String userId) {

		Users user = userRepo.findByUserId(userId);
		List<ProjectEntity> project = projectRepo.getProjectsByUserId(user.getId());
		List<ProjectResponse> projectList = new ArrayList<>();

		if (!project.isEmpty()) {

			for (ProjectEntity projects : project) {
				ProjectResponse response = new ProjectResponse();

				response.setProjectName(projects.getProjectName());
				response.setProjectType(projects.getProjectTeamType());
				response.setLeadBy(projects.getProjectLeader());
				response.setProjectAvatar(projects.getProjectImage());
				response.setProjectId(projects.getProjectId());
				response.setProjectIdentifier(projects.getProjectIdentifier());

				projectList.add(response);
			}

		}

		return projectList;
	}

	public ProjectResponse getProjectById(String id) {

		ProjectEntity project = projectRepo.findByProjectId(id);
		if (project != null) {

			ProjectResponse response = new ProjectResponse();

			response.setProjectName(project.getProjectName());
			response.setProjectType(project.getProjectTeamType());
			response.setLeadBy(project.getProjectLeader());
			response.setProjectAvatar(project.getProjectImage());
			response.setProjectId(project.getProjectId());
			response.setProjectIdentifier(project.getProjectIdentifier());

			return response;
		}

		throw new UserNotFoundException("Project not found with id" + id);
	}

	public String updateProject(UpdateProjectRequest projRequest) {

		ProjectEntity proj = projectRepo.findByProjectId(projRequest.getProjectId());

		if (proj != null) {

			proj.setProjectName(projRequest.getProjectName());

			projectRepo.save(proj);
			return "Project Updated successfully";
		}

		throw new ProjectNotFoundException("Project Not found with this project id");
	}

	public String deleteProject(String projectId, String userId) {

		ProjectEntity proj = projectRepo.findByProjectId(projectId);
		Users user = userRepo.findByUserId(userId);

		if (proj != null) {

			proj.setStatus(0);
			proj.setDeletedBy(user.getName());
			proj.setDeletedDate(new Date());

			projectRepo.save(proj);
			return "Project deleted successfully";
		}

		throw new ProjectNotFoundException("Project Not found with this project id");

	}

}
