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
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {
    
    @Id
    private String id;
    
    @NotBlank(message = "Product name is required")
    @Size(min = 2, max = 100, message = "Product name must be between 2 and 100 characters")
    @Indexed
    private String name;
    
    @NotBlank(message = "Product description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    
    @NotBlank(message = "Category is required")
    @Size(min = 2, max = 50, message = "Category must be between 2 and 50 characters")
    @Indexed
    private String category;
    
    @Builder.Default
    private Double rating = 0.0;
    
    @Builder.Default
    private Integer reviews = 0;
    
    @Builder.Default
    private Boolean ecoFriendly = false;
    
    private String imageUrl;
    
    private String blobId; // For Walrus storage on Sui blockchain
    
    @Builder.Default
    private Boolean active = true;
    
    @Builder.Default
    private Integer stockQuantity = 0;
    
    @Builder.Default
    private Boolean available = true;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Helper methods
    public void incrementReviews() {
        this.reviews++;
    }
    
    public void updateRating(Double newRating) {
        if (this.reviews == 0) {
            this.rating = newRating;
        } else {
            this.rating = ((this.rating * this.reviews) + newRating) / (this.reviews + 1);
        }
        this.reviews++;
    }
} 