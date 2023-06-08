package com.example.demo.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.demo.jwt.JWTAuthenticationFilter;

@CrossOrigin
@Configuration
@EnableWebSecurity
public class LibrarySecurityConfig {

	private static final String[] SECURED_URLs = {"/api/book/-1", "/api/book/save/**", "/api/delete/**"};

	private static final String[] UN_SECURED_URLs = { "/api/books", "/api/user/**", "/api/login", "/logout"
													, "/api/users", "/api/search/**", "/api/book/**", "/api/carts/**"
													, "/api/comments/**", "/api/comment/**"};

	@Autowired
	private JWTAuthenticationFilter authenticationFilter;

	@Autowired
	private LibraryUserDetailsService userDetailsService;

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder(); 
	}

	@Bean
	public UserDetailsService userDetailsService() {
		return new LibraryUserDetailsService();
	}

	@Bean
	public AuthenticationProvider authenticationProvider() {
		DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
		authenticationProvider.setUserDetailsService(userDetailsService());
		authenticationProvider.setPasswordEncoder(passwordEncoder());
		return authenticationProvider;
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.sessionManagement(a -> a.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
		http.addFilterBefore(authenticationFilter, UsernamePasswordAuthenticationFilter.class);
        http.formLogin(login->login.loginPage("http://localhost:3000/login"));
		
        return http
        		.csrf().disable() 
        		.authorizeHttpRequests().requestMatchers(UN_SECURED_URLs).permitAll().and() 
				.authorizeHttpRequests().requestMatchers(SECURED_URLs).hasAuthority("ADMIN").anyRequest()
				.authenticated().and().httpBasic().and().build(); 
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
		return authConfig.getAuthenticationManager();
	}

}