package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Cart;
import com.example.demo.entity.CartKey;
import com.example.demo.repository.CartRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.ICartService;

@Service
public class CartService implements ICartService{
	@Autowired
	CartRepository cartRepo;
	
	@Autowired
	UserRepository userRepo;

	@Override
	public List<Cart> findAllByUserId(Long userId) {
		return cartRepo.findAllById_UserId(userId);
	}
	
	@Override
	public void save(Long userId, Cart cart) {
		CartKey cartKey = new CartKey(userId, cart.getBook().getId());
		cartRepo.save(new Cart(cartKey, userRepo.findById(userId).get(), cart.getBook(), cart.getQuantity()));
	}

	@Override
	public void deleteByUsername(Long userId) {
		cartRepo.deleteById_UserId(userId);
	}

	@Override
	public void deleteByCartKey(Long userId, Cart cart) {
		cartRepo.deleteById(new CartKey(userId, cart.getBook().getId()));
	}	
}
