package com._3kstbackend.service.impl;

import com._3kstbackend.model.Media;
import com._3kstbackend.repository.MediaRepository;
import com._3kstbackend.service.MediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class MediaServiceImpl implements MediaService {
    private final MediaRepository mediaRepository;

    @Autowired
    public MediaServiceImpl(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    @Override
    public Media createMedia(Media media) {
        media.setId(null);
        media.setCreatedAt(LocalDateTime.now());
        media.setUpdatedAt(LocalDateTime.now());
        media.setUploadDate(LocalDateTime.now());
        return mediaRepository.save(media);
    }

    @Override
    public Media updateMedia(String id, Media media) {
        Optional<Media> existing = mediaRepository.findById(id);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Media not found");
        }
        media.setId(id);
        media.setCreatedAt(existing.get().getCreatedAt());
        media.setUpdatedAt(LocalDateTime.now());
        media.setUploadDate(existing.get().getUploadDate());
        return mediaRepository.save(media);
    }

    @Override
    public void deleteMedia(String id) {
        mediaRepository.deleteById(id);
    }

    @Override
    public Optional<Media> getMediaById(String id) {
        return mediaRepository.findById(id);
    }

    @Override
    public List<Media> getAllMedia() {
        return mediaRepository.findAll();
    }

    @Override
    public List<Media> getMediaByCategory(String category) {
        return mediaRepository.findByCategory(category);
    }

    @Override
    public List<Media> getMediaByType(Media.MediaType type) {
        return mediaRepository.findByType(type);
    }
} 