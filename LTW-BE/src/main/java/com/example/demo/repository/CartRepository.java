package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartKey;

public interface CartRepository extends JpaRepository<Cart, CartKey> {
	List<Cart> findAllById_UserId(Long id);
	List<Cart> findAllById_BookId(Long id);
	void deleteById_UserId(Long id);
}
