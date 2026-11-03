package com.tool.ProjectTool.security;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
import org.springframework.test.util.ReflectionTestUtils;

class TokenCookieProviderTest {

	private TokenCookieProvider provider(boolean secure) {
		TokenCookieProvider provider = new TokenCookieProvider();
		ReflectionTestUtils.setField(provider, "accessExpirationTime", 900000L);
		ReflectionTestUtils.setField(provider, "refreshExpirationTime", 604800000L);
		ReflectionTestUtils.setField(provider, "secure", secure);
		return provider;
	}

	@Test
	void accessCookieLivesAsLongAsTheTokenAndCannotBeReadByScripts() {
		ResponseCookie cookie = provider(false).createAccessCookie("signed-token");

		assertThat(cookie.getName()).isEqualTo(SecurityConstants.ACCESS_TOKEN_COOKIE);
		assertThat(cookie.getValue()).isEqualTo("signed-token");
		assertThat(cookie.getMaxAge().getSeconds()).isEqualTo(900);
		assertThat(cookie.isHttpOnly()).isTrue();
		assertThat(cookie.getSameSite()).isEqualTo("Strict");
		assertThat(cookie.getPath()).isEqualTo("/");
	}

	@Test
	void refreshCookieIsLongLivedAndOnlyTravelsToTheAuthRoutes() {
		ResponseCookie cookie = provider(false).createRefreshCookie("refresh-token");

		assertThat(cookie.getName()).isEqualTo(SecurityConstants.REFRESH_TOKEN_COOKIE);
		assertThat(cookie.getMaxAge().toDays()).isEqualTo(7);
		assertThat(cookie.isHttpOnly()).isTrue();
		assertThat(cookie.getSameSite()).isEqualTo("Strict");
		assertThat(cookie.getPath()).isEqualTo(SecurityConstants.REFRESH_COOKIE_PATH);
	}

	@Test
	void secureFlagFollowsTheSetting() {
		assertThat(provider(true).createAccessCookie("t").isSecure()).isTrue();
		assertThat(provider(true).createRefreshCookie("t").isSecure()).isTrue();
		assertThat(provider(false).createAccessCookie("t").isSecure()).isFalse();
		assertThat(provider(false).createRefreshCookie("t").isSecure()).isFalse();
	}

	@Test
	void clearingUsesTheSamePathsSoTheBrowserReplacesBothCookies() {
		List<ResponseCookie> cookies = provider(true).clearCookies();

		assertThat(cookies).hasSize(2).allSatisfy(cookie -> {
			assertThat(cookie.getValue()).isEmpty();
			assertThat(cookie.getMaxAge().isZero()).isTrue();
			assertThat(cookie.isHttpOnly()).isTrue();
			assertThat(cookie.isSecure()).isTrue();
		});
		assertThat(cookies.get(0).getPath()).isEqualTo("/");
		assertThat(cookies.get(1).getPath()).isEqualTo(SecurityConstants.REFRESH_COOKIE_PATH);
	}

}
