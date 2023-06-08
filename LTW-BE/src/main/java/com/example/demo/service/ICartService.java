package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Cart;

public interface ICartService {
	List<Cart> findAllByUserId(Long userId);
	
	void save(Long userId, Cart cart);
	
	void deleteByUsername(Long userId);

	void deleteByCartKey(Long userId, Cart cart);
}
