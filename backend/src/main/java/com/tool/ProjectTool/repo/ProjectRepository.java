package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.ProjectEntity;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

	public ProjectEntity findByProjectId(String id);

	public boolean existsByProjectIdentifier(String projectIdentifier);

	// Deleted projects are left out (status 0)
	@Query(value = "select * from projects p where user_id =:userId and status <> 0", nativeQuery = true)
	public List<ProjectEntity> getProjectsByUserId(long userId);

	// The lead's deleted projects, the latest first
	@Query(value = "select * from projects p where user_id =:userId and status = 0 order by deleted_date desc", nativeQuery = true)
	public List<ProjectEntity> getDeletedProjectsByUserId(long userId);

}
