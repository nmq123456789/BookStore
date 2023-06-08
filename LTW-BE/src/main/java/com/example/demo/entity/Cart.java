package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "cart")
@Data @AllArgsConstructor @NoArgsConstructor
public class Cart {
	@EmbeddedId
	private CartKey id;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@MapsId("userId")
	@JoinColumn(name = "userId")
	private User user;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@MapsId("bookId")
	@JoinColumn(name = "bookId")
	private Book book;
	
	private int quantity;
}
