package com.tool.ProjectTool.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.NotesEntity;

@Repository
public interface NotesRepository extends JpaRepository<NotesEntity, Long> {

	@Query(value = "select\r\n"
			+ "	id,\r\n"
			+ "	note_desc,\r\n"
			+ "	title\r\n"
			+ "from\r\n"
			+ "	notes n\r\n"
			+ "where\r\n"
			+ "	status = 'Active'\r\n"
			+ "	and \r\n"
			+ "	user_id=:userId\r\n"
			+ "	and \r\n"
			+ "	project_id =:projectId", nativeQuery = true)
	List<Object> getTaskDetailsByUserAndProjectId(String projectId, String userId);
	
	Optional<NotesEntity> findById(Long id);

}
