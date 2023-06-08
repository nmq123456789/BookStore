package com.example.demo.entity;

import org.hibernate.annotations.NaturalId;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user")
@Data @AllArgsConstructor @NoArgsConstructor
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(length = 100,  unique = true, nullable = false)
	private String email;
	
	@Column(nullable = false)
	private String password;
	private String roles;
}
