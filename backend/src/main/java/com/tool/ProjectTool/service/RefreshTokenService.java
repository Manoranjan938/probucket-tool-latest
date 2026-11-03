package com.tool.ProjectTool.service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HexFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tool.ProjectTool.entity.RefreshToken;
import com.tool.ProjectTool.model.response.RefreshSession;
import com.tool.ProjectTool.repo.RefreshTokenRepository;

@Service
public class RefreshTokenService {

	private static final int TOKEN_BYTES = 32;

	// Two tabs can refresh at once with the same token, that must not look like theft
	private static final long REUSE_GRACE_MS = 30000;

	private final SecureRandom random = new SecureRandom();

	@Autowired
	private RefreshTokenRepository refreshRepo;

	@Value("${app.jwt.refresh-expiration-ms}")
	private long refreshExpirationTime;

	@Transactional
	public RefreshSession startSession(String userId) {
		return issueToken(userId, UUID.randomUUID().toString());
	}

	// Swaps a token for a new one. Returns null when the token can't be used and the user has to log in again.
	@Transactional
	public RefreshSession rotate(String token) {

		RefreshToken current = refreshRepo.findByTokenHash(hash(token));
		Date now = new Date();

		if (current == null || current.getExpiresAt().before(now)) {
			return null;
		}

		if (refreshRepo.markUsed(current.getId(), now) == 1) {
			return issueToken(current.getUserId(), current.getFamilyId());
		}

		// usedAt is null here if another request swapped this token after it was read above
		Date usedAt = current.getUsedAt();
		if (usedAt == null || now.getTime() - usedAt.getTime() <= REUSE_GRACE_MS) {
			return new RefreshSession(current.getUserId(), current.getFamilyId(), null);
		}

		// A retired token came back, so someone has a copy of it. Both sides have to log in again.
		refreshRepo.deleteFamily(current.getFamilyId());
		return null;
	}

	@Transactional
	public void revokeSession(String token) {

		RefreshToken current = refreshRepo.findByTokenHash(hash(token));

		if (current != null) {
			refreshRepo.deleteFamily(current.getFamilyId());
		}
	}

	@Transactional
	public void revokeAllSessions(String userId) {
		refreshRepo.deleteAllForUser(userId);
	}

	@Transactional
	public void revokeOtherSessions(String userId, String sessionId) {
		refreshRepo.deleteOthersForUser(userId, sessionId);
	}

	@Scheduled(cron = "0 0 3 * * *")
	@Transactional
	public void deleteExpiredTokens() {
		refreshRepo.deleteExpired(new Date());
	}

	private RefreshSession issueToken(String userId, String familyId) {

		byte[] bytes = new byte[TOKEN_BYTES];
		random.nextBytes(bytes);
		String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

		RefreshToken refreshToken = new RefreshToken();
		refreshToken.setTokenHash(hash(token));
		refreshToken.setFamilyId(familyId);
		refreshToken.setUserId(userId);
		refreshToken.setExpiresAt(new Date(System.currentTimeMillis() + refreshExpirationTime));
		refreshRepo.save(refreshToken);

		return new RefreshSession(userId, familyId, token);
	}

	private String hash(String token) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
		} catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException("SHA-256 is not available", e);
		}
	}

}
