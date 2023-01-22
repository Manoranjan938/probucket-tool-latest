package com.tool.ProjectTool.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Long> {

	@Query(value = "select\r\n"
			+ "	*\r\n"
			+ "from\r\n"
			+ "	user_details ud\r\n"
			+ "where\r\n"
			+ "	username =:username\r\n"
			+ "	and email_verified = true", nativeQuery = true)
	public Users findByUsername(String username);
	
	public Users findByUserId(String userId);
	
	public Users findByEmail(String email);
	
	public Users findByVerifyToken(String token);
	
}
