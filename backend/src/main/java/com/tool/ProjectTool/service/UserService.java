package com.tool.ProjectTool.service;

import java.security.SecureRandom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.exception.UserAlreadyExistException;
import com.tool.ProjectTool.exception.UserNotFoundException;
import com.tool.ProjectTool.model.request.UpdatePasswordRequest;
import com.tool.ProjectTool.model.request.UpdateUserRequest;
import com.tool.ProjectTool.model.request.UserRequest;
import com.tool.ProjectTool.model.response.UserResponse;
import com.tool.ProjectTool.repo.UserRepository;


@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private RefreshTokenService refreshTokenService;

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
				users.setRoleName("ROLE_USER");
				users.setEmailVerified(false);
				users.setPassword(passEncode.encode(user.getPassword()));
				users.setStatus(0);
				String token = randomString(80);
				users.setVerifyToken(token);

				userRepo.save(users);
				emailService.sendVerifyAccount(user.getUsername(), token);

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

			String token = randomString(70);

			user.setVerifyToken(token);
			userRepo.save(user);
			emailService.sendPasswordReset(email, token);

			return "Email sended";
		}

		throw new UserNotFoundException("User not found with this email" + email);
	}

	// A password reset means the account may be compromised, so every device has to log in again
	@Transactional
	public String resetPassword(String token, String pass) {

		Users user = userRepo.findByVerifyToken(token);

		if (user != null) {

			user.setVerifyToken(null);
			user.setPassword(passEncode.encode(pass));

			userRepo.save(user);
			refreshTokenService.revokeAllSessions(user.getUserId());

			return "Password updated successdully";
		}

		throw new UserNotFoundException("User does not exist or invalid token");
	}
	
	// The device changing the password stays logged in, the others have to log in again
	@Transactional
	public String updatePassword(UpdatePasswordRequest passReq, String sessionId) {
		
		Users user = userRepo.findByUserId(passReq.getUserId());
		if(user != null) {
			
			user.setPassword(passEncode.encode(passReq.getPassword()));
			
			userRepo.save(user);
			refreshTokenService.revokeOtherSessions(user.getUserId(), sessionId);
			return "Password updated successdully";
		}
		
		throw new UserNotFoundException("User does not exist");
	}

}
