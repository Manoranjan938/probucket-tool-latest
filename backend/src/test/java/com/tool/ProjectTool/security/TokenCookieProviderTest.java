package com.tool.ProjectTool.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;
import org.springframework.test.util.ReflectionTestUtils;

class TokenCookieProviderTest {

	private TokenCookieProvider provider(boolean secure) {
		TokenCookieProvider provider = new TokenCookieProvider();
		ReflectionTestUtils.setField(provider, "expirationTime", 18000000L);
		ReflectionTestUtils.setField(provider, "secure", secure);
		return provider;
	}

	@Test
	void cookieLivesAsLongAsTheTokenAndCannotBeReadByScripts() {
		ResponseCookie cookie = provider(false).createCookie("signed-token");

		assertThat(cookie.getName()).isEqualTo(SecurityConstants.TOKEN_COOKIE);
		assertThat(cookie.getValue()).isEqualTo("signed-token");
		assertThat(cookie.getMaxAge().getSeconds()).isEqualTo(18000);
		assertThat(cookie.isHttpOnly()).isTrue();
		assertThat(cookie.getSameSite()).isEqualTo("Strict");
		assertThat(cookie.getPath()).isEqualTo("/");
	}

	@Test
	void secureFlagFollowsTheSetting() {
		assertThat(provider(true).createCookie("signed-token").toString()).contains("Secure");
		assertThat(provider(false).createCookie("signed-token").toString()).doesNotContain("Secure");
	}

	@Test
	void clearingKeepsTheSameAttributesSoTheBrowserReplacesTheCookie() {
		ResponseCookie cookie = provider(true).clearCookie();

		assertThat(cookie.getValue()).isEmpty();
		assertThat(cookie.getMaxAge().isZero()).isTrue();
		assertThat(cookie.isHttpOnly()).isTrue();
		assertThat(cookie.isSecure()).isTrue();
		assertThat(cookie.getPath()).isEqualTo("/");
	}

}
