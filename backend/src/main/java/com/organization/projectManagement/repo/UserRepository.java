package com.organization.projectManagement.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.organization.projectManagement.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	public User getById(Long id);
	
	public User findByUsername(String username);
	
	public Optional<User> findByEmail(String email);
	
}
