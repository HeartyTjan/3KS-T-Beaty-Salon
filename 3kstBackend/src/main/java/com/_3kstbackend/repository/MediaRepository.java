package com._3kstbackend.repository;

import com._3kstbackend.model.Media;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {
    List<Media> findByCategory(String category);
    List<Media> findByType(Media.MediaType type);
} 