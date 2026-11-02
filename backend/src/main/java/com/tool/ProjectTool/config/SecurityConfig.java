package com.tool.ProjectTool.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.tool.ProjectTool.security.AuthenticationFilter;
import com.tool.ProjectTool.security.CustomAuthenticationEntryPoint;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.service.CustomUserService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfig {

	@Autowired
	private BCryptPasswordEncoder passEncode;

	@Autowired
	private CustomUserService customService;

	@Autowired
	private CustomAuthenticationEntryPoint entryPoint;

	@Bean
	public AuthenticationFilter authFilter() throws Exception {
		return new AuthenticationFilter();
	}

	@Bean
	public AuthenticationManager authenticationManager() {

		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(customService);
		provider.setPasswordEncoder(passEncode);

		return new ProviderManager(provider);
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.csrf(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.exceptionHandling(exception -> exception.authenticationEntryPoint(entryPoint))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// TODO(boot-migration): every route without @RolesAllowed is public. SIGN_UP_URLS does not match the real
		// /api/v1/... routes and the old config had no catch-all, so anyRequest().permitAll() keeps that behaviour.
		http.authorizeHttpRequests(auth -> auth
			.requestMatchers(SecurityConstants.SIGN_UP_URLS).permitAll()
			.anyRequest().permitAll());
		//http.authorizeRequests().antMatchers("/api/home/**").hasAuthority("ROLE_USER");
		//http.authorizeRequests().antMatchers("/api/v1/project/**").authenticated();
		http.addFilterBefore(authFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
