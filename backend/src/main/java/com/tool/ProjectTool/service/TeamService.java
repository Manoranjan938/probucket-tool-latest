package com.tool.ProjectTool.service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.TeamDetails;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.exception.UserAlreadyExistException;
import com.tool.ProjectTool.exception.UserNotFoundException;
import com.tool.ProjectTool.model.request.RequestTeamMember;
import com.tool.ProjectTool.model.request.UpdateTeamRequest;
import com.tool.ProjectTool.model.response.NewTeamMemberResponse;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;
import com.tool.ProjectTool.repo.ProjectRepository;
import com.tool.ProjectTool.repo.TeamRepository;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class TeamService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private TeamRepository teamRepo;
	
	@Autowired
	private ProjectRepository projectRepo;
	
	@Autowired
	private ActivityService activityService;
	
	@Autowired
	private BCryptPasswordEncoder passEncode;
	
	@Autowired
	private EmailService emailService;
	
	static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	static SecureRandom rnd = new SecureRandom();

	String randomString(int len) {
		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++)
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		return sb.toString();
	}

	public NewTeamMemberResponse createNewTeamMember(RequestTeamMember teamReq) {
		
		String ids = randomString(20);
		String id = null;
		
		Users user = userRepo.findByEmail(teamReq.getEmail());
		Users checkIds = userRepo.findByUserId(ids);
		
		if(user != null) {
			throw new UserAlreadyExistException("User with email " + teamReq.getEmail() + " is already exists.");
		}

		// Nobody is added to a project that doesn't exist or is deleted
		ProjectEntity project = projectRepo.findByProjectId(teamReq.getProjectId());
		if (project == null || project.isDeleted()) {
			throw new ProjectNotFoundException("Project not found");
		}
		
		Users newUser = new Users();
		TeamDetails team = new TeamDetails();
		
		String randomPass = randomString(14);
		String token = randomString(60);
		
		if (checkIds != null) {
			id = randomString(20);
		} else {
			id = ids;
		}
		
		newUser.setUserId(id);
		newUser.setEmail(teamReq.getEmail());
		newUser.setUsername(teamReq.getEmail());
		newUser.setName(teamReq.getName());
		newUser.setEmailVerified(false);
		newUser.setPassword(passEncode.encode(randomPass));
		newUser.setRoleName("ROLE_TEAM-USER");
		newUser.setVerifyToken(token);
		
		Users newUs = userRepo.save(newUser);
		
		team.setProjectId(teamReq.getProjectId());
		team.setUserId(newUs.getId());
		
		teamRepo.save(team);

		activityService.recordMemberAdded(project.getProjectIdentifier(), newUser.getName());
		
		emailService.sendTeamInvite(teamReq.getEmail(), token, inviterName(project), project.getProjectName());
		
		return new NewTeamMemberResponse(randomPass);
	}
	
	public List<TeamMembersList> getTeamList(String projectId) {

		List<Object> teams = teamRepo.getTeamListByProject(projectId);
		if (teams != null) {
			List<TeamMembersList> teamList = new ArrayList<>();
			Iterator itr = teams.iterator();
			while (itr.hasNext()) {
				Object[] row = (Object[]) itr.next();
				TeamMembersList teamLi = new TeamMembersList();

				teamLi.setEmail(String.valueOf(row[0]));
				teamLi.setName(String.valueOf(row[1]));
				teamLi.setUserid((Long) row[2]);
				teamLi.setAddedDate(String.valueOf(row[3]));
				teamLi.setRole(String.valueOf(row[5]));
				teamLi.setStatus((Integer) row[4]);
				teamLi.setMemberId(String.valueOf(row[6]));

				teamList.add(teamLi);
			}

			return teamList;
		}
		throw new ProjectNotFoundException("Project not found with id" + projectId);
	}
	
	public List<ProjectResponse> getAllProjects(String userId) {

		Users user = userRepo.findByUserId(userId);
		if (user != null) {

			List<Object> project = teamRepo.getProjectsByTeamMember(user.getId().intValue());
			List<ProjectResponse> projectList = new ArrayList<>();

			if (!project.isEmpty()) {

				Iterator itr = project.iterator();
				while (itr.hasNext()) {
					Object[] row = (Object[]) itr.next();

					ProjectResponse pr = new ProjectResponse();
					pr.setProjectName(String.valueOf(row[0]));
					pr.setProjectId(String.valueOf(row[1]));
					pr.setProjectIdentifier(String.valueOf(row[2]));
					pr.setLeadBy(String.valueOf(row[3]));
					pr.setProjectType(String.valueOf(row[4]));
					pr.setProjectAvatar(String.valueOf(row[5]));

					projectList.add(pr);

				}
			}

			return projectList;

		}
		throw new ProjectNotFoundException("Project not found with userid: " + userId);
	}
	
	public String updateTeamMember(UpdateTeamRequest teamRe) {

		TeamDetails team = teamRepo.findByUserId(teamRe.getUserid());

		if (team != null) {

			Users user = userRepo.getReferenceById(teamRe.getUserid());

			if (user != null) {
				team.setTeamRole(teamRe.getRole());
				teamRepo.save(team);

				if (teamRe.getStatus().equalsIgnoreCase("Inactive")) {
					user.setStatus(1);
				}
				if(teamRe.getStatus().equalsIgnoreCase("active")){
					user.setStatus(0);
				}

				userRepo.save(user);
			}
			return "User updated successfully";
		}

		throw new UserNotFoundException("Team member not found");
	}

	// Named in the invite email: the person who added them, from the login; else the project's lead
	private String inviterName(ProjectEntity project) {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth != null && auth.getPrincipal() instanceof Users me && me.getName() != null) {
			return me.getName();
		}
		Users lead = project.getUser();
		return lead != null && lead.getName() != null ? lead.getName() : "Your project lead";
	}
}
