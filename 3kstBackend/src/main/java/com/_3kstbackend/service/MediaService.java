package com._3kstbackend.service;

import com._3kstbackend.model.Media;
import java.util.List;
import java.util.Optional;

public interface MediaService {
    Media createMedia(Media media);
    Media updateMedia(String id, Media media);
    void deleteMedia(String id);
    Optional<Media> getMediaById(String id);
    List<Media> getAllMedia();
    List<Media> getMediaByCategory(String category);
    List<Media> getMediaByType(Media.MediaType type);
} 