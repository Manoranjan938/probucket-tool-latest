package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.TeamDetails;

@Repository
public interface TeamRepository extends JpaRepository<TeamDetails, Long> {

	@Query(value="select\r\n"
			+ "	ud.email,\r\n"
			+ "	ud.name,\r\n"
			+ "	ud.id,\r\n"
			+ "	ud.added_date,\r\n"
			+ "	ud.status,\r\n"
			+ "	td.team_role\r\n"
			+ "from\r\n"
			+ "	user_details ud\r\n"
			+ "join team_details td on\r\n"
			+ "	td.user_id = ud.id\r\n"
			+ "where\r\n"
			+ "	project_id =:proId", nativeQuery = true)
	List<Object> getTeamListByProject(String proId);
	
	@Query(value = "select\r\n"
			+ "	p.project_name,\r\n"
			+ "	p.project_id,\r\n"
			+ "	p.project_identifier,\r\n"
			+ "	p.project_leader,\r\n"
			+ "	p.project_team_type,\r\n"
			+ "	p.project_image\r\n"
			+ "from\r\n"
			+ "	projects p\r\n"
			+ "join team_details td on\r\n"
			+ "	td.project_id = p.project_id\r\n"
			+ "where\r\n"
			+ "	td.user_id=:userId", nativeQuery = true)
	List<Object> getProjectsByTeamMember(int userId);
	
	TeamDetails findByUserId(long userId);
	
}
