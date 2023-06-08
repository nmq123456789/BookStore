package com.example.demo.entity;

import java.sql.Date;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "comments")
@Data @AllArgsConstructor @NoArgsConstructor
public class Comment {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "book_id")
	private Book book;
	
	@Column(columnDefinition = "nvarchar(255)")
	private String comment;
	
	private int rating;
	
	private Date date;
}