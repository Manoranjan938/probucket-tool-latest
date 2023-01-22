package com.tool.ProjectTool.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class CustomUserService implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Users user = userRepo.findByUsername(username);

		if (user == null) {
			throw new UsernameNotFoundException("User not found.");
		}

		return user;
	}

	@Transactional
	public Users loadUserByUserId(String userId) {

		Users user = userRepo.findByUserId(userId);

		if (user == null) {
			throw new UsernameNotFoundException("User not found.");
		}

		return user;
	}

}
