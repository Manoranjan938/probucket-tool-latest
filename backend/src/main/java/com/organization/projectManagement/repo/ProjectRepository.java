package com.organization.projectManagement.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.organization.projectManagement.entity.ProjectEntity;
import com.organization.projectManagement.model.response.ProjectResponse;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

	public Iterable<ProjectResponse> findAllByProjectLeader(String projectLeader);
	
}
