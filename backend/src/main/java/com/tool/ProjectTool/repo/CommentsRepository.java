package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.Comment;

@Repository
public interface CommentsRepository extends JpaRepository<Comment, Long>{
	
	@Query(value = "select\r\n"
			+ "	c.username,\r\n"
			+ "	c.id,\r\n"
			+ "	c.comment,\r\n"
			+ "	c.commented_date\r\n"
			+ "from\r\n"
			+ "	comments c\r\n"
			+ "join project_task pt on\r\n"
			+ "	pt.id = c.commented_on_type\r\n"
			+ "where\r\n"
			+ "	pt.project_sequence=:taskId", nativeQuery = true)
	List<Object> findCommentsByTaskId(String taskId);

}
