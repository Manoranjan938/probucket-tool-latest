package com.tool.ProjectTool.config;

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

import com.tool.ProjectTool.security.AuthenticationFilter;
import com.tool.ProjectTool.security.CustomAuthenticationEntryPoint;
import com.tool.ProjectTool.security.SecurityConstants;
import com.tool.ProjectTool.service.CustomUserService;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, jsr250Enabled = true, prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
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
		http.csrf().disable().formLogin()
			.disable().httpBasic()
			.disable().exceptionHandling()
			.authenticationEntryPoint(entryPoint)
			.and()
			.sessionManagement()
			.sessionCreationPolicy(SessionCreationPolicy.STATELESS);

		http.authorizeRequests().antMatchers(SecurityConstants.SIGN_UP_URLS).permitAll();
		//http.authorizeRequests().antMatchers("/api/home/**").hasAuthority("ROLE_USER");
		//http.authorizeRequests().antMatchers("/api/v1/project/**").authenticated();
		http.addFilterBefore(authFilter(), UsernamePasswordAuthenticationFilter.class);
	}

}
