package com.tool.ProjectTool.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
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

import jakarta.servlet.DispatcherType;

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
		// withDefaults() uses the @CrossOrigin settings of the controllers, so preflights and 401s keep their CORS headers
		// CSRF tokens are not used: the login cookie is SameSite=Strict, so browsers don't send it from other sites
		http.cors(Customizer.withDefaults())
			.csrf(AbstractHttpConfigurer::disable)
			.formLogin(AbstractHttpConfigurer::disable)
			.httpBasic(AbstractHttpConfigurer::disable)
			.exceptionHandling(exception -> exception.authenticationEntryPoint(entryPoint))
			.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

		// ERROR dispatches render the response of an already rejected or failed request
		http.authorizeHttpRequests(auth -> auth
			.dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
			.requestMatchers(SecurityConstants.PUBLIC_URLS).permitAll()
			.anyRequest().authenticated());
		http.addFilterBefore(authFilter(), UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

}
