package com.example.demo.jwt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entity.User;
import com.example.demo.service.impl.UserService;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class JWTController {
	
	@Autowired
    private JWTService jwtService;
	
    @Autowired
	private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody JWTAuthenticationRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUserName(), authRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Lấy thông tin idUser từ cơ sở dữ liệu
            User user = userService.getUserByEmail(authRequest.getUserName());
            String idUser = user.getId().toString();
            String email = user.getEmail();
            String token = jwtService.generateToken(userDetails);
            String role = extractRoleFromUserDetails(userDetails);
            
            Map<String, String> response = new HashMap<>();
 
            response.put("token", token);
            response.put("role", role);
            response.put("idUser",idUser);
            response.put("email", email);

            return ResponseEntity.ok(response);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    
    private String extractRoleFromUserDetails(UserDetails userDetails) {
        return userDetails.getAuthorities().iterator().next().getAuthority();
    }
}