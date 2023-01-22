package com.organization.projectManagement.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.organization.projectManagement.security.AuthenticationFilter;
import com.organization.projectManagement.security.JwtAuthenticationEntryPoint;
import com.organization.projectManagement.security.SecurityConstants;
import com.organization.projectManagement.security.oauth2.CustomOAuth2UserService;
import com.organization.projectManagement.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepo;
import com.organization.projectManagement.security.oauth2.OAuth2AuthenticationFailureHandler;
import com.organization.projectManagement.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.organization.projectManagement.service.CustomUserService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private JwtAuthenticationEntryPoint entryPoint;
	
	@Autowired
	private CustomUserService customService;
	
	@Autowired
    private CustomOAuth2UserService customOAuth2UserService;
	
	@Autowired
    private OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
	
	@Autowired
    private OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

	@Bean
	public AuthenticationFilter authFilter() {
		return new AuthenticationFilter();
	}
	
	 /*
	    By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save
	    the authorization request. But, since our service is stateless, we can't save it in
	    the session. We'll save the request in a Base64 encoded cookie instead.
	  */
	@Bean
    public HttpCookieOAuth2AuthorizationRequestRepo cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepo();
    }
	
	@Autowired
	private BCryptPasswordEncoder passEncode;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		
		auth.userDetailsService(customService).passwordEncoder(passEncode);
	}

	@Override
	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	protected AuthenticationManager authenticationManager() throws Exception {
		
		return super.authenticationManager();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		http.cors().and().csrf().disable()
					.formLogin()
						.disable()
					.httpBasic()
						.disable()
					.exceptionHandling().authenticationEntryPoint(entryPoint)
						.and()
					.sessionManagement()
					.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
						.and()
					.authorizeRequests()
					.antMatchers(
							"/",
							"/**/favicon.ico",
							"/**/*.png",
							"/**/*.gif",
							"/**/*.svg",
							"/**/*.jpg",
							"/**/*.html",
							"/**/*.css",
							"/**/*.js"
							)
					.permitAll()
					.antMatchers(SecurityConstants.SIGN_UP_URLS).permitAll()
					.anyRequest().authenticated()
						.and()
					.oauth2Login()
						.authorizationEndpoint()
						.baseUri("/oauth2/authorize")
						.authorizationRequestRepository(cookieAuthorizationRequestRepository())
						.and()
					.redirectionEndpoint()
						.baseUri("/oauth2/callback/*")
						.and()
					.userInfoEndpoint()
						.userService(customOAuth2UserService)
						.and()
					.successHandler(oAuth2AuthenticationSuccessHandler)
					.failureHandler(oAuth2AuthenticationFailureHandler);
					
		http.addFilterBefore(authFilter(), UsernamePasswordAuthenticationFilter.class);
		
	}
	
}
