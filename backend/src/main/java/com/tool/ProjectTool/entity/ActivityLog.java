package com.tool.ProjectTool.entity;

import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

// One row per change. Names are copied in, so an entry keeps reading the same if someone is renamed later.
@Entity
@Table(name = "activity_log", indexes = {
		@Index(name = "idx_activity_log_project", columnList = "project_identifier, created_at"),
		@Index(name = "idx_activity_log_task", columnList = "task_sequence, created_at")
})
public class ActivityLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Plain text: with @Enumerated, Hibernate adds a CHECK constraint that ddl-auto=update never widens for new types
	@Column(nullable = false)
	private String type;

	@Column(name = "project_identifier", nullable = false)
	private String projectIdentifier;

	// Null for changes that aren't about a task
	@Column(name = "task_sequence")
	private String taskSequence;

	@Column(name = "task_name")
	private String taskName;

	@Column(name = "actor_id")
	private String actorId;

	@Column(name = "actor_name")
	private String actorName;

	@Column(name = "old_value")
	private String oldValue;

	@Column(name = "new_value")
	private String newValue;

	@Column(name = "created_at")
	private Date createdAt;

	// Entries from the activity queue already carry the time of the change
	@PrePersist
	protected void onCreate() {
		if (this.createdAt == null) {
			this.createdAt = new Date();
		}
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public ActivityType getType() {
		return ActivityType.valueOf(type);
	}

	public void setType(ActivityType type) {
		this.type = type.name();
	}

	public String getProjectIdentifier() {
		return projectIdentifier;
	}

	public void setProjectIdentifier(String projectIdentifier) {
		this.projectIdentifier = projectIdentifier;
	}

	public String getTaskSequence() {
		return taskSequence;
	}

	public void setTaskSequence(String taskSequence) {
		this.taskSequence = taskSequence;
	}

	public String getTaskName() {
		return taskName;
	}

	public void setTaskName(String taskName) {
		this.taskName = taskName;
	}

	public String getActorId() {
		return actorId;
	}

	public void setActorId(String actorId) {
		this.actorId = actorId;
	}

	public String getActorName() {
		return actorName;
	}

	public void setActorName(String actorName) {
		this.actorName = actorName;
	}

	public String getOldValue() {
		return oldValue;
	}

	public void setOldValue(String oldValue) {
		this.oldValue = oldValue;
	}

	public String getNewValue() {
		return newValue;
	}

	public void setNewValue(String newValue) {
		this.newValue = newValue;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

}
