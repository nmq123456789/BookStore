package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.Cart;
import com.example.demo.service.impl.CartService;

@RestController
@CrossOrigin
@RequestMapping("/api")
public class CartController {
	
	@Autowired
	CartService cartService;
	
	@GetMapping("/carts/{userId}")
	public List<Cart> getAll(@PathVariable String userId){
		return cartService.findAllByUserId(Long.parseLong(userId));
	}
	
	@PostMapping("/carts/{userId}")
	public void addCart(@PathVariable("userId") String userId, @RequestBody Cart newCart) {
		cartService.save(Long.parseLong(userId), newCart);
	}
	
	@DeleteMapping("/carts/{userId}")
	public void deleteCart(@PathVariable("userId") String userId, @RequestBody Cart newCart) {
		if(newCart != null) {
			cartService.deleteByCartKey(Long.parseLong(userId), newCart);
		}
		else cartService.deleteByUsername(Long.parseLong(userId));
	}
}
