package com.example.demo.entity;
import java.sql.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "book")
@Data @NoArgsConstructor @AllArgsConstructor
public class Book {
	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(columnDefinition = "nvarchar(255)")
	private String title;

	@Column(columnDefinition = "nvarchar(255)")
	private String author;

	@Column(columnDefinition = "nvarchar(255)")
	private String category;

	@Column(columnDefinition = "nvarchar(255)")
	private String description;
	
	@Column(columnDefinition = "nvarchar(255)")
	private String imgName;

	private Date date;
	private int sold;
	private int page;
	private long price;
}