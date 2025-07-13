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

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {
    private final MediaService mediaService;
    // @Autowired private WalrusService walrusService; // Uncomment if you have a WalrusService

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadMedia(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Upload file to Walrus and get blobId (pseudo-code)
            String blobId = "walrus-blob-id"; // Replace with actual upload logic
            // if (walrusService != null) blobId = walrusService.upload(file);

            // 2. Save media metadata
            Media media = Media.builder()
                    .name(file.getOriginalFilename())
                    .type(Media.MediaType.IMAGE)
                    .url("https://walrus.sui/" + blobId) // Replace with actual URL logic
                    .category("profile")
                    .alt(file.getOriginalFilename())
                    .blobId(blobId)
                    .size((file.getSize() / 1024) + " KB")
                    .sizeInBytes(file.getSize())
                    .build();
            mediaService.createMedia(media);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("blobId", blobId);
            response.put("mediaId", media.getId());
            response.put("url", media.getUrl());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 