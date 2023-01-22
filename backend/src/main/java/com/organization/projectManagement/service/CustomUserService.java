package com.organization.projectManagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.organization.projectManagement.entity.User;
import com.organization.projectManagement.repo.UserRepository;

@Service
public class CustomUserService implements UserDetailsService {
	
	@Autowired
	private UserRepository userRepo;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		
		User newUser = userRepo.findByUsername(username);
		
		if(newUser == null) {
			new UsernameNotFoundException("User not found"); 
		}
		
		return newUser;
	}
	
	public User loadUserById(Long id) {
		
		User newUser = userRepo.getById(id);
		
		if(newUser == null) {
			new UsernameNotFoundException("User not found"); 
		}
		
		return newUser;
	}

}
