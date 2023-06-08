package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.User;

public interface IUserService {
	User add(User user);

	List<User> getAllUsers();

	void delete(String email);

	User getUser(String email);

	User update(User user);
}

