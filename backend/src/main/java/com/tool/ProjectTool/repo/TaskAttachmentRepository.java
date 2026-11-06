package com.tool.ProjectTool.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.TaskAttachment;

@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {

	List<TaskAttachment> findByTaskSequenceOrderByCreatedAtAsc(String taskSequence);

	long countByTaskSequence(String taskSequence);

	TaskAttachment findByAttachmentId(String attachmentId);
}
