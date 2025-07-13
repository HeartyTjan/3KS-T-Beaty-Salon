package com._3kstbackend.service.impl;

import com._3kstbackend.model.RefreshToken;
import com._3kstbackend.repository.RefreshTokenRepository;
import com._3kstbackend.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;
    private static final long REFRESH_TOKEN_EXPIRY_HOURS = 48;

    @Override
    public RefreshToken createRefreshToken(String userId) {
        // Remove old tokens
        refreshTokenRepository.deleteByUserId(userId);
        String token = generateToken();
        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(REFRESH_TOKEN_EXPIRY_HOURS))
                .build();
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public boolean validateRefreshToken(String token) {
        Optional<RefreshToken> refreshToken = refreshTokenRepository.findByToken(token);
        return refreshToken.isPresent() && refreshToken.get().getExpiryDate().isAfter(LocalDateTime.now());
    }

    @Override
    public void deleteByUserId(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Override
    public RefreshToken getByToken(String token) {
        return refreshTokenRepository.findByToken(token).orElse(null);
    }

    private String generateToken() {
        byte[] randomBytes = new byte[64];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }
} 