package com.tool.ProjectTool.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.repo.UserRepository;

@Service
public class CustomUserService implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;

	@Autowired
	private UserLookup userLookup;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		Users user = userRepo.findByUsername(username);

		if (user == null) {
			throw new UsernameNotFoundException("User not found.");
		}

		return user;
	}

	/** The logged-in user from the cache: what the app reads of it, without the password (see CachedUser) */
	public Users loadUserByUserId(String userId) {
		return userLookup.find(userId).toUser();
	}
}
