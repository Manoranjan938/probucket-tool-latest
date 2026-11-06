package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.ActivityLog;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long>, JpaSpecificationExecutor<ActivityLog> {

	/** Someone who made a change, under a name they had then */
	interface Actor {
		String getActorId();

		String getActorName();
	}

	List<ActivityLog> findByProjectIdentifierOrderByCreatedAtDescIdDesc(String projectIdentifier, Pageable page);

	List<ActivityLog> findByTaskSequenceOrderByCreatedAtDescIdDesc(String taskSequence, Pageable page);

	// A renamed person appears once per name, the latest name first
	@Query("select a.actorId as actorId, a.actorName as actorName from ActivityLog a"
			+ " where a.projectIdentifier = :projectIdentifier and a.actorId is not null"
			+ " group by a.actorId, a.actorName order by max(a.createdAt) desc")
	List<Actor> findActors(@Param("projectIdentifier") String projectIdentifier);

}
