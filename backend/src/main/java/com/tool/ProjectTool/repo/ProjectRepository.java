package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.ProjectEntity;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

	public ProjectEntity findByProjectId(String id);

	@Query(value = "select * from projects p where user_id =:userId", nativeQuery = true)
	public List<ProjectEntity> getProjectsByUserId(long userId);

}
