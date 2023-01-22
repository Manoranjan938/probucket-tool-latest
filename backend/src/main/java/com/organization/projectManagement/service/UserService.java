package com.organization.projectManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.organization.projectManagement.entity.AuthProvider;
import com.organization.projectManagement.entity.User;
import com.organization.projectManagement.exception.UserAlreadyExistException;
import com.organization.projectManagement.repo.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private BCryptPasswordEncoder passEncode;
	
	public User createUser(User user) {
		
		try {
			String email = user.getEmail();
			
			User existUser = userRepo.findByUsername(email);
			if(existUser != null) {
				throw new UserAlreadyExistException("User with '" + email + "' already exist.");
			}
			
			user.setPassword(passEncode.encode(user.getPassword()));
			user.setUsername(email);
			user.setRole("ROLE_PERSONAL");
			user.setProvider(AuthProvider.local);
			
			return userRepo.save(user);
		}catch(Exception e) {
			throw new UserAlreadyExistException("User with '" + user.getEmail() + "' already exist.");
		}
	}
	
}
