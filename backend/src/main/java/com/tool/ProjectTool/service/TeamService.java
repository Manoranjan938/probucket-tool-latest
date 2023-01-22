package com.tool.ProjectTool.service;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.tool.ProjectTool.entity.ProjectEntity;
import com.tool.ProjectTool.entity.TeamDetails;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.ProjectNotFoundException;
import com.tool.ProjectTool.exception.UserAlreadyExistException;
import com.tool.ProjectTool.model.request.RequestTeamMember;
import com.tool.ProjectTool.model.request.UpdateTeamRequest;
import com.tool.ProjectTool.model.response.EmailResponse;
import com.tool.ProjectTool.model.response.ProjectResponse;
import com.tool.ProjectTool.model.response.TeamMembersList;
import com.tool.ProjectTool.repo.TeamRepository;
import com.tool.ProjectTool.repo.UserRepository;

import freemarker.template.Configuration;
import freemarker.template.Template;
import net.bytebuddy.utility.RandomString;

@Service
public class TeamService {
	
	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private TeamRepository teamRepo;
	
	@Autowired
	private BCryptPasswordEncoder passEncode;
	
	@Autowired
	private JavaMailSender mailSender;

	@Autowired
	private Configuration config;
	
	static final String AB = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	static SecureRandom rnd = new SecureRandom();

	String randomString(int len) {
		StringBuilder sb = new StringBuilder(len);
		for (int i = 0; i < len; i++)
			sb.append(AB.charAt(rnd.nextInt(AB.length())));
		return sb.toString();
	}

	public String createNewTeamMember(RequestTeamMember teamReq) {
		
		String ids = randomString(20);
		String id = null;
		
		Users user = userRepo.findByEmail(teamReq.getEmail());
		Users checkIds = userRepo.findByUserId(ids);
		
		if(user != null) {
			throw new UserAlreadyExistException("User with email " + teamReq.getEmail() + " is already exists.");
		}
		
		Users newUser = new Users();
		TeamDetails team = new TeamDetails();
		
		String randomPass = RandomString.make(14);
		String token = RandomString.make(60);
		
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
		
		sendNewTeamMemberConfirmationEmail(teamReq.getEmail(), token);
		
		return "New team member added sucessfully with temporary password: " + randomPass;
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
				teamLi.setUserid((BigInteger) row[2]);
				teamLi.setAddedDate(String.valueOf(row[3]));
				teamLi.setRole(String.valueOf(row[5]));
				teamLi.setStatus((Integer) row[4]);

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

			Users user = userRepo.getById(teamRe.getUserid());

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

		return null;
	}

	public EmailResponse sendNewTeamMemberConfirmationEmail(String email, String secretString) {

		EmailResponse response = new EmailResponse();
		MimeMessage message = mailSender.createMimeMessage();

		Map<String, Object> model = new HashMap<>();

		try {

			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
					StandardCharsets.UTF_8.name());

			// helper.addAttachment("logo.png", new ClassPathResource("/static/logo.png"));

			model.put("token", secretString);

			Template t = config.getTemplate("registration-confirmation-template.ftl");
			String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);

			helper.setTo(email);
			helper.setText(html, true);
			helper.setSubject("Complete your password reset request");
			helper.setFrom("probucket@info.co.in");
			helper.addInline("logo.png", new ClassPathResource("logo.png"));

			mailSender.send(message);

			response.setMessage("Mail send to: " + email + " and successfuly requested.");
			response.setStatus(true);

		} catch (Exception e) {
			response.setMessage(
					"Mail Sending failure " + e.getMessage() + " and something went wrong while requesting.");
			response.setStatus(false);
		}

		return response;

	}
	
}
