package com._3kstbackend.controller;

import com._3kstbackend.dto.*;
import com._3kstbackend.model.RefreshToken;
import com._3kstbackend.model.User;
import com._3kstbackend.service.RefreshTokenService;
import com._3kstbackend.service.UserService;
import com._3kstbackend.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import com._3kstbackend.service.EmailService;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;


    // Registration
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRegistrationRequest request) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .build();
        User created = userService.createUser(user);
        String token = jwtUtil.generateToken(created.getEmail(), created.getRole());
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .user(toUserResponse(created))
                .build());
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserLoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = (User) authentication.getPrincipal();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .user(toUserResponse(user))
                .build());
    }

    // Get current user (by Principal)
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();
        Optional<User> userOpt = userService.getUserByEmail(principal.getName());
        return userOpt.map(user -> ResponseEntity.ok(toUserResponse(user)))
                .orElseGet(() -> ResponseEntity.status(404).build());
    }

    // Update user profile
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable String id, @RequestBody UserRegistrationRequest request) {
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .country(request.getCountry())
                .city(request.getCity())
                .avatarId(request.getAvatarId())
                .build();
        User updated = userService.updateUser(id, user);
        return ResponseEntity.ok(toUserResponse(updated));
    }

    // Add Admin (Super Admin only)
    @PostMapping("/admins")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> addAdmin(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        try {
            userService.createAdminWithRandomPassword(email);
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin created. Password was logged to server."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Remove Admin (Super Admin only)
    @DeleteMapping("/admins/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<?> removeAdmin(@PathVariable String id) {
        try {
            userService.removeAdminById(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin removed."));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // Delete user (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // List all users (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Refresh token endpoint
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request) {
        if (!refreshTokenService.validateRefreshToken(request.getRefreshToken())) {
            return ResponseEntity.status(401).build();
        }
        RefreshToken refreshToken = refreshTokenService.getByToken(request.getRefreshToken());
        Optional<User> userOpt = userService.getUserById(refreshToken.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).build();
        }
        User user = userOpt.get();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .user(toUserResponse(user))
                .build());
    }

    @PostMapping("/verify-email")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> request) {
        System.out.println("Email verification request received: " + request);
        String token = request.get("token");
        boolean verified = userService.verifyEmail(token);
        if (verified) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Email verified successfully.");
            System.out.println("Email verification successful for token: " + token);
            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid or expired verification token.");
            System.out.println("Email verification failed for token: " + token);
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/resend-verification")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(@RequestBody Map<String, String> request) {
        System.out.println("Resend verification request received: " + request);
        String email = request.get("email");
        try {
            userService.resendVerificationEmail(email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Verification email sent successfully.");
            System.out.println("Resend verification successful for email: " + email);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            System.out.println("Resend verification failed for email: " + email + ", error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        boolean verified = userService.verifyEmail(token);
        if (verified) {
            return ResponseEntity.ok("Email verified successfully.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired verification token.");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        userService.forgotPassword(request.getEmail());
        // Always return success to prevent email enumeration
        return ResponseEntity.ok("If your email exists, a reset link has been sent.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean success = userService.resetPassword(request.getToken(), request.getNewPassword(), passwordEncoder);
        if (success) {
            return ResponseEntity.ok("Password reset successful.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired reset token.");
        }
    }


    @PostMapping("/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable String id, @RequestBody ChangePasswordRequest request) {
        boolean changed = userService.changePassword(id, request.getOldPassword(), request.getNewPassword(), passwordEncoder);
        if (changed) {
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Password changed successfully."));
        } else {
            return ResponseEntity.status(400).body(Map.of("success", false, "message", "Old password is incorrect."));
        }
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .city(user.getCity())
                .country(user.getCountry())
                .build();
    }
} 