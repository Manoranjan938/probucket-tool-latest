package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.ActivityLog;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

	List<ActivityLog> findByProjectIdentifierOrderByCreatedAtDescIdDesc(String projectIdentifier, Pageable page);

	List<ActivityLog> findByTaskSequenceOrderByCreatedAtDescIdDesc(String taskSequence, Pageable page);

}
