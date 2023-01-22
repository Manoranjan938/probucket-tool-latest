package com.tool.ProjectTool.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.Backlog;

@Repository
public interface BacklogRepository extends JpaRepository<Backlog, Long> {

	Backlog findByProjectIdentifier(String projectIdentifier);
	
}
