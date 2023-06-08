package com.example.demo.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.impl.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {
	@Autowired
    private  UserService userService;
	
	@Autowired
	private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers(){
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.FOUND);
    }
    
    @PostMapping("user/add")
    public ResponseEntity<User> add(@RequestBody User user){
//    	System.out.println(userRepository.existsByEmail(user.getEmail()));
//    	System.out.println(user.getEmail());
    	if(userRepository.existsByEmail(user.getEmail())) {
    		return ResponseEntity.status(401).body(null);
    	}
    	
        return ResponseEntity.ok(userService.add(user));
    }

    @GetMapping("user/{email}")
    public User getByEmail(@PathVariable("email") String email){
        return  userService.getUser(email);
    }

    @DeleteMapping("user/{email}")
    public void delete(@PathVariable("email") String email){
        userService.delete(email);
    }

    @PutMapping("user/update")
    public ResponseEntity<User> update(@RequestBody User user){
        return ResponseEntity.ok(userService.update(user));
    }

}