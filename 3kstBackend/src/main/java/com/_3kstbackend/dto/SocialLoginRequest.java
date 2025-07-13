package com._3kstbackend.dto;

import lombok.Data;

@Data
public class SocialLoginRequest {
    private String provider; // e.g., "google"
    private String accessToken;
} 