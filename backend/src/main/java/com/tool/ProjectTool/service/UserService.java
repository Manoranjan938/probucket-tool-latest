package com.tool.ProjectTool.service;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.HashMap;
import java.util.Map;

import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.UserAlreadyExistException;
import com.tool.ProjectTool.exception.UserNotFoundException;
import com.tool.ProjectTool.model.request.UpdatePasswordRequest;
import com.tool.ProjectTool.model.request.UpdateUserRequest;
import com.tool.ProjectTool.model.request.UserRequest;
import com.tool.ProjectTool.model.response.EmailResponse;
import com.tool.ProjectTool.model.response.UserResponse;
import com.tool.ProjectTool.repo.UserRepository;

import freemarker.template.Configuration;
import freemarker.template.Template;
import net.bytebuddy.utility.RandomString;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;

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

	public String createUser(UserRequest user) {

		try {
			String email = user.getUsername();
			String ids = randomString(20);
			String id = null;

			Users existUser = userRepo.findByEmail(email);
			Users checkIds = userRepo.findByUserId(ids);

			if (existUser == null) {
				Users users = new Users();

				users.setUsername(email);
				users.setEmail(email);
				users.setName(user.getName());

				if (checkIds != null) {
					id = randomString(20);
				} else {
					id = ids;
				}
				users.setUserId(id);
				users.setRoleName(user.getRoleName());
				users.setEmailVerified(false);
				users.setPassword(passEncode.encode(user.getPassword()));
				users.setStatus(0);
				String token = RandomString.make(80);
				users.setVerifyToken(token);

				userRepo.save(users);
				sendRegistrationConfirmationEmail(user.getUsername(), token);

				return "User Added successfully";

			}

			throw new UserAlreadyExistException("User with '" + email + "' already exist.");
		} catch (Exception e) {
			throw new UserAlreadyExistException("User with '" + user.getUsername() + "' already exist.");
		}
	}

	public String verifyUser(String token) {

		Users user = userRepo.findByVerifyToken(token);

		if (user != null) {

			user.setEmailVerified(true);
			user.setVerifyToken(null);

			userRepo.save(user);

			return "User verified successdully";
		}

		throw new UserNotFoundException("User does not exist or invalid token");
	}

	public String updateUser(UpdateUserRequest request) {

		try {

			Users user = userRepo.findById(request.getUserId()).get();

			if (user != null) {
				user.setName(request.getName());
				user.setPhone(request.getPhone());
				user.setEmail(request.getEmail());

				userRepo.save(user);

				return "User updated successfully";
			}

		} catch (Exception e) {
			throw new UserNotFoundException("User not found");
		}

		return null;
	}

	public UserResponse getUserDetails(String email) {

		try {

			Users user = userRepo.findByUsername(email);
			UserResponse uRes = new UserResponse();

			if (user != null) {

				uRes.setName(user.getName());
				uRes.setUserEmail(user.getEmail());
				uRes.setUserPic(user.getImageUrl());
				uRes.setUserId(user.getUserId());
				uRes.setUserRole(user.getRoleName());

				return uRes;
			}
			throw new UserNotFoundException("User not found");
		} catch (Exception e) {
			throw new UserNotFoundException("User not found");
		}
	}

	public String requestResetPssword(String email) {

		Users user = userRepo.findByEmail(email);

		if (user != null) {

			String token = RandomString.make(70);

			user.setVerifyToken(token);
			userRepo.save(user);
			sendPasswordChangeRequestEmail(email, token);

			return "Email sended";
		}

		throw new UserNotFoundException("User not found with this email" + email);
	}

	public String resetPassword(String token, String pass) {

		Users user = userRepo.findByVerifyToken(token);

		if (user != null) {

			user.setVerifyToken(null);
			user.setPassword(passEncode.encode(pass));

			userRepo.save(user);

			return "Password updated successdully";
		}

		throw new UserNotFoundException("User does not exist or invalid token");
	}
	
	public String updatePassword(UpdatePasswordRequest passReq) {
		
		Users user = userRepo.findByUserId(passReq.getUserId());
		if(user != null) {
			
			user.setPassword(passEncode.encode(passReq.getPassword()));
			
			userRepo.save(user);
			return "Password updated successdully";
		}
		
		throw new UserNotFoundException("User does not exist");
	}

	public EmailResponse sendRegistrationConfirmationEmail(String email, String token) {

		EmailResponse response = new EmailResponse();
		MimeMessage message = mailSender.createMimeMessage();

		Map<String, Object> model = new HashMap<>();

		try {

			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
					StandardCharsets.UTF_8.name());

			// helper.addAttachment("logo.png", new ClassPathResource("/static/logo.png"));

			model.put("token", token);

			Template t = config.getTemplate("registration-confirmation-template.ftl");
			String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, model);

			helper.setTo(email);
			helper.setText(html, true);
			helper.setSubject("Verify email request");
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

	public EmailResponse sendPasswordChangeRequestEmail(String email, String token) {

		EmailResponse response = new EmailResponse();
		MimeMessage message = mailSender.createMimeMessage();

		Map<String, Object> model = new HashMap<>();

		try {

			MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
					StandardCharsets.UTF_8.name());

			// helper.addAttachment("logo.png", new ClassPathResource("/static/logo.png"));

			model.put("token", token);

			Template t = config.getTemplate("password-change-template.ftl");
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
