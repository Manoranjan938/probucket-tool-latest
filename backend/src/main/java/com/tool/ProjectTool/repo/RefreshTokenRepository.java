package com.tool.ProjectTool.repo;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tool.ProjectTool.entity.RefreshToken;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	public RefreshToken findByTokenHash(String tokenHash);

	// Only one of several simultaneous requests gets a count of 1
	@Modifying
	@Query("update RefreshToken t set t.usedAt = :usedAt where t.id = :id and t.usedAt is null")
	public int markUsed(Long id, Date usedAt);

	@Modifying
	@Query("delete from RefreshToken t where t.familyId = :familyId")
	public int deleteFamily(String familyId);

	@Modifying
	@Query("delete from RefreshToken t where t.userId = :userId")
	public int deleteAllForUser(String userId);

	@Modifying
	@Query("delete from RefreshToken t where t.userId = :userId and t.familyId <> :familyId")
	public int deleteOthersForUser(String userId, String familyId);

	@Modifying
	@Query("delete from RefreshToken t where t.expiresAt < :now")
	public int deleteExpired(Date now);

}
