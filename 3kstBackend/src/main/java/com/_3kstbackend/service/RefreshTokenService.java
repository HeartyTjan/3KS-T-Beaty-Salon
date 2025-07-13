package com._3kstbackend.service;

import com._3kstbackend.model.RefreshToken;

public interface RefreshTokenService {
    RefreshToken createRefreshToken(String userId);
    boolean validateRefreshToken(String token);
    void deleteByUserId(String userId);
    RefreshToken getByToken(String token);
} 