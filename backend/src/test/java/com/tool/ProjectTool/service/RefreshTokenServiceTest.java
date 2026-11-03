package com.tool.ProjectTool.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.HexFormat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import com.tool.ProjectTool.entity.RefreshToken;
import com.tool.ProjectTool.model.response.RefreshSession;
import com.tool.ProjectTool.repo.RefreshTokenRepository;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

	private static final String TOKEN = "raw-token";

	private static final long DAY_MS = 86400000L;

	@Mock
	private RefreshTokenRepository refreshRepo;

	@InjectMocks
	private RefreshTokenService service;

	@BeforeEach
	void setExpiration() {
		ReflectionTestUtils.setField(service, "refreshExpirationTime", 7 * DAY_MS);
	}

	private String hash(String token) throws Exception {
		return HexFormat.of().formatHex(
				MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8)));
	}

	private RefreshToken stored(Date expiresAt, Date usedAt) throws Exception {
		RefreshToken stored = new RefreshToken();
		stored.setId(1L);
		stored.setUserId("me");
		stored.setFamilyId("family");
		stored.setExpiresAt(expiresAt);
		stored.setUsedAt(usedAt);
		when(refreshRepo.findByTokenHash(hash(TOKEN))).thenReturn(stored);
		return stored;
	}

	private Date fromNow(long ms) {
		return new Date(System.currentTimeMillis() + ms);
	}

	@Test
	void startSessionStoresOnlyTheHashOfANewToken() throws Exception {
		RefreshSession session = service.startSession("me");

		ArgumentCaptor<RefreshToken> saved = ArgumentCaptor.forClass(RefreshToken.class);
		verify(refreshRepo).save(saved.capture());

		assertEquals(hash(session.refreshToken()), saved.getValue().getTokenHash());
		assertFalse(saved.getValue().getTokenHash().contains(session.refreshToken()));
		assertEquals(session.sessionId(), saved.getValue().getFamilyId());
		assertEquals("me", saved.getValue().getUserId());
	}

	@Test
	void everyLoginIsItsOwnSession() {
		assertFalse(service.startSession("me").sessionId().equals(service.startSession("me").sessionId()));
	}

	@Test
	void unknownTokenIsRefused() {
		assertNull(service.rotate(TOKEN));
		verify(refreshRepo, never()).save(any());
	}

	@Test
	void expiredTokenIsRefused() throws Exception {
		stored(fromNow(-1000), null);

		assertNull(service.rotate(TOKEN));
		verify(refreshRepo, never()).save(any());
	}

	@Test
	void rotatingRetiresTheTokenAndRenewsTheSessionInTheSameFamily() throws Exception {
		stored(fromNow(1000), null);
		when(refreshRepo.markUsed(any(), any())).thenReturn(1);

		RefreshSession session = service.rotate(TOKEN);

		assertNotNull(session.refreshToken());
		assertFalse(TOKEN.equals(session.refreshToken()));
		assertEquals("family", session.sessionId());

		ArgumentCaptor<RefreshToken> saved = ArgumentCaptor.forClass(RefreshToken.class);
		verify(refreshRepo).save(saved.capture());
		long renewedFor = saved.getValue().getExpiresAt().getTime() - System.currentTimeMillis();
		assertEquals(7 * DAY_MS, renewedFor, 5000);
	}

	@Test
	void reuseInsideTheGracePeriodGetsNoNewRefreshToken() throws Exception {
		stored(fromNow(DAY_MS), fromNow(-5000));

		RefreshSession session = service.rotate(TOKEN);

		assertNull(session.refreshToken());
		assertEquals("family", session.sessionId());
		verify(refreshRepo, never()).save(any());
		verify(refreshRepo, never()).deleteFamily(any());
	}

	@Test
	void losingARaceWithAnotherRequestCountsAsTheGracePeriod() throws Exception {
		stored(fromNow(DAY_MS), null);
		when(refreshRepo.markUsed(any(), any())).thenReturn(0);

		RefreshSession session = service.rotate(TOKEN);

		assertNull(session.refreshToken());
		verify(refreshRepo, never()).deleteFamily(any());
	}

	@Test
	void reuseAfterTheGracePeriodEndsTheWholeSession() throws Exception {
		stored(fromNow(DAY_MS), fromNow(-60000));

		assertNull(service.rotate(TOKEN));
		verify(refreshRepo).deleteFamily("family");
		verify(refreshRepo, never()).save(any());
	}

	@Test
	void revokingEndsTheWholeSession() throws Exception {
		stored(fromNow(DAY_MS), null);

		service.revokeSession(TOKEN);

		verify(refreshRepo).deleteFamily("family");
	}

	@Test
	void revokingAnUnknownTokenDoesNothing() {
		service.revokeSession(TOKEN);

		verify(refreshRepo, never()).deleteFamily(any());
	}

}
