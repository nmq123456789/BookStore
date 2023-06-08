package com.example.demo.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class JWTService {

    @Value("${spring.jwt.secret}")
    private String JWT_SECRET;

    @Value("${spring.jwt.jwtExpirationInMs}")
    private int JWT_EXPIRATION_TIME_IN_MILLISECONDS;

    public String generateToken(UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<String> roles = extractRolesFromUserDetails(userDetails);
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        return tokenCreator(claims, username);
    }

    public String extractUsernameFromToken(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public List<String> extractRolesFromToken(String token) {
        return extractClaim(token, claims -> claims.get("roles", List.class));
    }

    public String extractRoleFromToken(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public Date extractExpirationTimeFromToken(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(getSignedKey()).build().parseClaimsJws(token).getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractExpirationTimeFromToken(token).before(new Date());
    }

    private Key getSignedKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_SECRET);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    private List<String> extractRolesFromUserDetails(UserDetails userDetails) {
        return userDetails.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    private String tokenCreator(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION_TIME_IN_MILLISECONDS))
                .signWith(getSignedKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}