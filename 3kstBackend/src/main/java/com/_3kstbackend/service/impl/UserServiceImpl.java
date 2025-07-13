package com._3kstbackend.service.impl;

import com._3kstbackend.model.User;
import com._3kstbackend.repository.UserRepository;
import com._3kstbackend.service.EmailService;
import com._3kstbackend.service.UserService;
import com._3kstbackend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final BookingService bookingService;

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    @Transactional
    @Override
    public User createUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new DuplicateKeyException("Email already exists");
        }
        user.setId(null);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setEmailVerified(false);
        user.setEmailVerificationToken(UUID.randomUUID().toString());
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(24));

        User created = userRepository.save(user);
        
        // Link any existing guest bookings to this user
        try {
            bookingService.linkAllGuestBookingsToUser(user.getEmail(), created.getId());
        } catch (Exception e) {
            // Log error but don't fail user creation
            System.err.println("Failed to link guest bookings: " + e.getMessage());
        }
        
        // Send verification email
        String verifyUrl = frontendUrl + "/verify-email?token="
                + created.getEmailVerificationToken()
                + "&email=" + created.getEmail();

        String subject = "Email Verification - 3KS&T";

        String content = String.format(
                """
                <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                    <p>Dear %s,</p>
            
                    <p>Welcome to <strong>3KS&T</strong>! Please verify your email address by clicking the button below:</p>
            
                    <p>
                        <a href="%s" style="
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #4F46E5;
                            color: white;
                            text-decoration: none;
                            border-radius: 6px;
                            font-weight: bold;
                        ">Verify Email</a>
                    </p>
            
                    <p>This link will expire in 24 hours.</p>
            
                    <p>If you didn't create an account, please ignore this email.</p>
            
                    <p>Best regards,<br>The 3KS&T Team</p>
                </body>
                </html>
                """,
                created.getFirstName(),
                verifyUrl
        );
        emailService.sendEmail(created.getEmail(), subject, content);
        return created;
    }

    @Override
    public User updateUser(String id, User user) {
        Optional<User> existingOpt = userRepository.findById(id);
        if (existingOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User existing = existingOpt.get();
        user.setId(id);
        user.setCreatedAt(existing.getCreatedAt());
        user.setUpdatedAt(LocalDateTime.now());
        // Only update password if provided and different
        if (user.getPassword() != null && !user.getPassword().isBlank() && !passwordEncoder.matches(user.getPassword(), existing.getPassword())) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        } else {
            user.setPassword(existing.getPassword());
        }
        // Update country, city, avatarId if provided
        user.setCountry(user.getCountry() != null ? user.getCountry() : existing.getCountry());
        user.setCity(user.getCity() != null ? user.getCity() : existing.getCity());
        user.setAvatarId(user.getAvatarId() != null ? user.getAvatarId() : existing.getAvatarId());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getEmailVerificationToken()))
            .findFirst();
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if token is expired
            if (user.getEmailVerificationTokenExpiry() != null && 
                user.getEmailVerificationTokenExpiry().isBefore(LocalDateTime.now())) {
                return false; // Token expired
            }
            
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            user.setEmailVerificationTokenExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }


    @Transactional
    @Override
    public void forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String token = UUID.randomUUID().toString();
            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusHours(2));
            userRepository.save(user);
            String resetUrl = frontendUrl + "/reset-password?token=" + token;
            String subject = "Password Reset Request";
            String content = "<p>Click <a href='" + resetUrl + "'>here</a> to reset your password. This link expires in 2 hours.</p>";
            emailService.sendEmail(user.getEmail(), subject, content);
        }
    }

    @Transactional
    @Override
    public boolean resetPassword(String token, String newPassword, PasswordEncoder passwordEncoder) {
        Optional<User> userOpt = userRepository.findAll().stream()
            .filter(u -> token.equals(u.getResetToken()) && u.getResetTokenExpiry() != null && u.getResetTokenExpiry().isAfter(LocalDateTime.now()))
            .findFirst();
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Override
    public void resendVerificationEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        
        User user = userOpt.get();
        if (user.isEmailVerified()) {
            throw new IllegalArgumentException("Email is already verified");
        }
        
        // Generate new verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationTokenExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);
        
        // Send verification email
        String verificationLink = frontendUrl + "/verify-email?token=" + verificationToken + "&email=" + email;
        String subject = "Email Verification - 3KS&T";
        String body = String.format(
            "Dear %s,\n\n" +
            "Please verify your email address by clicking the link below:\n\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't create an account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The 3KS&T Team",
            user.getFirstName(),
            verificationLink
        );
        
        emailService.sendEmail(email, subject, body);
    }

    @Override
    public boolean changePassword(String userId, String oldPassword, String newPassword, PasswordEncoder passwordEncoder) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) return false;
        User user = userOpt.get();
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Override
    public void createSuperAdminIfNotExists(String email, String password) {
        if (userRepository.findByEmail(email).isEmpty()) {
            User superAdmin = User.builder()
                    .firstName("Super")
                    .lastName("Admin")
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role("SUPER_ADMIN")
                    .enabled(true)
                    .build();
            userRepository.save(superAdmin);
            logger.info("Super Admin created with email: {}", email);
        }
    }

    @Override
    public void createAdminWithRandomPassword(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("User with this email already exists");
        }
        String randomPassword = java.util.UUID.randomUUID().toString().substring(0, 8);
        User admin = User.builder()
                .firstName("Admin")
                .lastName("")
                .email(email)
                .password(passwordEncoder.encode(randomPassword))
                .role("ADMIN")
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Send email to the newly created admin
        String subject = "Admin Account Created - 3KS&T";
        String content = String.format(
                """
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                        <h2 style="color: #5c67f2;">Admin Account Created</h2>
                        
                        <p>Dear Admin,</p>
                        
                        <p>Your admin account has been created for <strong>3KS&T</strong>.</p>
                        
                        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0;">Your Login Credentials:</h3>
                            <p><strong>Email:</strong> %s</p>
                            <p><strong>Password:</strong> %s</p>
                        </div>
                        
                        <p><strong>Important:</strong> Please change your password after your first login for security.</p>
                        
                        <p>You can access the admin portal at: <a href="%s/admin">%s/admin</a></p>
                        
                        <p style="margin-top: 30px;">Best regards,<br><strong>The 3KS&T Team</strong></p>
                    </div>
                </body>
                </html>
                """,
                email,
                randomPassword,
                frontendUrl,
                frontendUrl
        );
        
        emailService.sendEmail(email, subject, content);
    }

    @Override
    public void removeAdminById(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Admin not found"));
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalArgumentException("User is not an admin");
        }
        userRepository.deleteById(id);
        logger.info("Admin removed with id: {}", id);
    }
} 