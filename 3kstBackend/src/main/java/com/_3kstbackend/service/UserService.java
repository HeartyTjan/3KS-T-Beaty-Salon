package com._3kstbackend.service;

import com._3kstbackend.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserService {


    @Transactional
    User createUser(User user);

    User updateUser(String id, User user);
    void deleteUser(String id);
    Optional<User> getUserById(String id);
    Optional<User> getUserByEmail(String email);
    List<User> getAllUsers();

    boolean verifyEmail(String token);

    @Transactional
    void resendVerificationEmail(String email);

    @Transactional
    void forgotPassword(String email);

    @Transactional
    boolean resetPassword(String token, String newPassword, PasswordEncoder passwordEncoder);

    // Change password
    boolean changePassword(String userId, String oldPassword, String newPassword, PasswordEncoder passwordEncoder);

    // Super Admin bootstrapping
    void createSuperAdminIfNotExists(String email, String password);

    // Admin management
    void createAdminWithRandomPassword(String email);
    void removeAdminById(String id);
}