package com._3kstbackend.config;

import com._3kstbackend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SuperAdminInitializer implements CommandLineRunner {
    
    private final UserService userService;
    
    @Value("${superadmin_email}")
    private String superAdminUsername;
    
    @Value("${superadmin_password}")
    private String superAdminPassword;
    
    @Override
    public void run(String... args) throws Exception {
        userService.createSuperAdminIfNotExists(superAdminUsername, superAdminPassword);
    }
} 