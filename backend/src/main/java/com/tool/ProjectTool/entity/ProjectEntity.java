package com.tool.ProjectTool.entity;

import java.util.Date;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Transient;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "projects")
public class ProjectEntity {

	public static final int ACTIVE = 1;

	public static final int DELETED = 0;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String projectId;
	
	private String projectName;
	
	private String projectDescription;
	
	private String projectAccessType;
	
	private String projectTemplateType;
	
	private String projectTeamType;
	
	private String projectLeader;
	
	private String projectImage;
	
	private String projectIdentifier;
	
	private String projectRole;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnore
	private Users user;
	
	@OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "project")
	private Backlog backlog;
	
	private int status = ACTIVE;
	
	private String deletedBy;
	
	private Date deletedDate;
	
	private Date createdAt;
	
	private Date updatedAt;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectDescription() {
		return projectDescription;
	}

	public void setProjectDescription(String projectDescription) {
		this.projectDescription = projectDescription;
	}

	public String getProjectAccessType() {
		return projectAccessType;
	}

	public void setProjectAccessType(String projectAccessType) {
		this.projectAccessType = projectAccessType;
	}

	public String getProjectTemplateType() {
		return projectTemplateType;
	}

	public void setProjectTemplateType(String projectTemplateType) {
		this.projectTemplateType = projectTemplateType;
	}

	public String getProjectTeamType() {
		return projectTeamType;
	}

	public void setProjectTeamType(String projectTeamType) {
		this.projectTeamType = projectTeamType;
	}

	public String getProjectLeader() {
		return projectLeader;
	}

	public void setProjectLeader(String projectLeader) {
		this.projectLeader = projectLeader;
	}

	public String getProjectImage() {
		return projectImage;
	}

	public void setProjectImage(String projectImage) {
		this.projectImage = projectImage;
	}

	public Users getUser() {
		return user;
	}

	public void setUser(Users user) {
		this.user = user;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	/** Deleted projects have status 0 and stay restorable until they are removed for good */
	@Transient
	public boolean isDeleted() {
		return status == DELETED;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	public String getProjectIdentifier() {
		return projectIdentifier;
	}

	public void setProjectIdentifier(String projectIdentifier) {
		this.projectIdentifier = projectIdentifier;
	}

	public Backlog getBacklog() {
		return backlog;
	}

	public void setBacklog(Backlog backlog) {
		this.backlog = backlog;
	}

	public String getProjectRole() {
		return projectRole;
	}

	public void setProjectRole(String projectRole) {
		this.projectRole = projectRole;
	}

	public String getDeletedBy() {
		return deletedBy;
	}

	public void setDeletedBy(String deletedBy) {
		this.deletedBy = deletedBy;
	}

	public Date getDeletedDate() {
		return deletedDate;
	}

	public void setDeletedDate(Date deletedDate) {
		this.deletedDate = deletedDate;
	}

	@PrePersist
	protected void onCreate() {
		this.createdAt = new Date();
	}
	
	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = new Date();
	}

}
