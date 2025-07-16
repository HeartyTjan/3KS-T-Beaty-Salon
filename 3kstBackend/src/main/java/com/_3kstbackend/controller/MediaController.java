package com._3kstbackend.controller;

import com._3kstbackend.model.Media;
import com._3kstbackend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;

    // Save a media entry (with before/after URLs, alt, etc.)
    @PostMapping("")
    public ResponseEntity<Media> createMedia(@RequestBody Media media) {
        Media saved = mediaService.createMedia(media);
        return ResponseEntity.ok(saved);
    }

    // Fetch all media entries
    @GetMapping("")
    public ResponseEntity<List<Media>> getAllMedia() {
        return ResponseEntity.ok(mediaService.getAllMedia());
    }

    // GET /api/media/count - Get total media count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getMediaCount() {
        int count = mediaService.getAllMedia().size();
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
} 