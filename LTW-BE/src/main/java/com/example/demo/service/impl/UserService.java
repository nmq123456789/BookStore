package com.example.demo.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.IUserService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
	
	@Autowired
    private UserRepository userRepository;


    @Autowired 
    private PasswordEncoder passwordEncoder;

    @Override
    public User add(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void delete(String email) {
        userRepository.deleteByEmail(email);
    }

	@Override
	public User getUser(String email) {
	      return userRepository.findByEmail(email).get();
	}       

    @Override
    public User update(User user) {
        user.setRoles(user.getRoles());
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        List<User> list = userRepository.findAll();
        if(list.size()==0) {
            return null;
        }else {
            for(User u:list) {
                if(u.getEmail().equalsIgnoreCase(email)){
                    return u;
                }
            }
        }
        return null;
    }
}