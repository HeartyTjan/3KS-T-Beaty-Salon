package com._3kstbackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "media")
public class Media {
    
    @Id
    private String id;
    
    @NotBlank(message = "Media name is required")
    @Size(min = 2, max = 100, message = "Media name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Media type is required")
    private MediaType type; // IMAGE, VIDEO
    
    // Deprecated: use beforeUrl/afterUrl for before/after images
    private String url;

    // New fields for before/after images
    private String beforeUrl;
    private String afterUrl;
    
    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    @Indexed
    private String category;
    
    @NotBlank(message = "Alt text is required")
    @Size(min = 2, max = 200, message = "Alt text must be between 2 and 200 characters")
    private String alt;
    
    private String blobId; // For Walrus storage on Sui blockchain
    
    private String size; // e.g., "2.3 MB"
    
    private Long sizeInBytes; // For sorting and filtering
    
    @Builder.Default
    private Boolean active = true;
    
    private LocalDateTime uploadDate;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Helper methods
    public boolean isImage() {
        return MediaType.IMAGE.equals(type);
    }
    
    public boolean isVideo() {
        return MediaType.VIDEO.equals(type);
    }
    
    public String getFileExtension() {
        if (name != null && name.contains(".")) {
            return name.substring(name.lastIndexOf(".") + 1);
        }
        return "";
    }
    
    public enum MediaType {
        IMAGE,
        VIDEO
    }
} 