package com._3kstbackend.service;

public interface EmailService {
    void sendEmail(String to, String subject, String content);
} 