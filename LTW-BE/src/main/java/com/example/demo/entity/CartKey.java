package com.example.demo.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartKey implements Serializable  {
	private static final long serialVersionUID = 1L;

	Long userId;

	Long bookId;

	@Override
	public boolean equals(Object obj) {
		CartKey ck = (CartKey) obj;
		return ck.userId == userId && ck.bookId == bookId;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return super.hashCode();
	}
}
