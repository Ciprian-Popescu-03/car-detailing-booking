package com.ciprian.detailing.web.controller;

import com.ciprian.detailing.entity.AdminUser;
import com.ciprian.detailing.repository.AdminUserRepository;
import com.ciprian.detailing.security.JwtService;
import com.ciprian.detailing.web.dto.LoginRequest;
import com.ciprian.detailing.web.dto.LoginResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.adminUserRepository = adminUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        return new LoginResponse(jwtService.generateToken(request.username(), "ADMIN"));
    }

    /**
     * One-time setup endpoint: only works while no admin account exists yet, so there's no pre-baked
     * password hash sitting in a migration file. Self-disables permanently once the first admin is created.
     */
    @PostMapping("/bootstrap-admin")
    public ResponseEntity<?> bootstrapAdmin(@Valid @RequestBody LoginRequest request) {
        if (adminUserRepository.count() > 0) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("An admin account already exists - this endpoint is now disabled.");
        }
        AdminUser admin = AdminUser.builder()
                .username(request.username())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role("ADMIN")
                .createdAt(LocalDateTime.now())
                .build();
        adminUserRepository.save(admin);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new LoginResponse(jwtService.generateToken(admin.getUsername(), "ADMIN")));
    }
}
