package com.tool.ProjectTool.service;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tool.ProjectTool.cache.CacheNames;
import com.tool.ProjectTool.cache.CachedUser;
import com.tool.ProjectTool.entity.Users;
import com.tool.ProjectTool.repo.UserRepository;

// The logged-in user, read on every request by the auth filter, so it is cached (cleared by CacheClearer when
// the user changes). Its own bean, so the cache applies when CustomUserService calls it.
@Service
public class UserLookup {

	private final UserRepository userRepo;

	public UserLookup(UserRepository userRepo) {
		this.userRepo = userRepo;
	}

	@Cacheable(cacheNames = CacheNames.USERS, key = "#userId")
	public CachedUser find(String userId) {
		Users user = userRepo.findByUserId(userId);
		if (user == null) {
			throw new UsernameNotFoundException("User not found.");
		}
		return CachedUser.of(user);
	}
}
