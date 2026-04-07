package com.librahub.library.controller;

import com.librahub.library.config.JwtUtil;
import com.librahub.library.dto.LoginRequest;
import com.librahub.library.dto.LoginResponse;
import com.librahub.library.model.User;
import com.librahub.library.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        UserDetails ud = userDetailsService.loadUserByUsername(req.getUsername());
        User user = userDetailsService.findUser(req.getUsername());
        String token = jwtUtil.generateToken(ud);
        return ResponseEntity.ok(new LoginResponse(token, user.getUsername(), user.getRole().name()));
    }
}
