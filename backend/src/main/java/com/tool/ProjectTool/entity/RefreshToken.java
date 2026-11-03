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

// One row per issued token. All the tokens of one login share a familyId, which is the session.
@Entity
@Table(name = "refresh_tokens", indexes = {
		@Index(name = "idx_refresh_tokens_family_id", columnList = "family_id"),
		@Index(name = "idx_refresh_tokens_user_id", columnList = "user_id"),
		@Index(name = "idx_refresh_tokens_expires_at", columnList = "expires_at")
})
public class RefreshToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// Only the hash is stored, so a leaked database holds no usable tokens
	@Column(name = "token_hash", nullable = false, unique = true)
	private String tokenHash;

	@Column(name = "family_id", nullable = false)
	private String familyId;

	@Column(name = "user_id", nullable = false)
	private String userId;

	@Column(name = "expires_at", nullable = false)
	private Date expiresAt;

	// Set once the token has been swapped for a new one
	@Column(name = "used_at")
	private Date usedAt;

	@Column(name = "created_at")
	private Date createdAt;

	@PrePersist
	protected void onCreate() {
		this.createdAt = new Date();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTokenHash() {
		return tokenHash;
	}

	public void setTokenHash(String tokenHash) {
		this.tokenHash = tokenHash;
	}

	public String getFamilyId() {
		return familyId;
	}

	public void setFamilyId(String familyId) {
		this.familyId = familyId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getExpiresAt() {
		return expiresAt;
	}

	public void setExpiresAt(Date expiresAt) {
		this.expiresAt = expiresAt;
	}

	public Date getUsedAt() {
		return usedAt;
	}

	public void setUsedAt(Date usedAt) {
		this.usedAt = usedAt;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

}
