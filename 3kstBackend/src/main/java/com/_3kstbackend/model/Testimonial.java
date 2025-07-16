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
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import java.time.LocalDate;  
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "testimonials")
public class Testimonial {
    
    @Id
    private String id;
    private String userId;
    
    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Customer name must be between 2 and 100 characters")
    private String name;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer rating;
    
    @NotBlank(message = "Testimonial text is required")
    @Size(min = 10, max = 1000, message = "Testimonial text must be between 10 and 1000 characters")
    private String text;
    
    private String imageUrl;
    
    
    @NotBlank(message = "Service is required")
    @Size(min = 2, max = 100, message = "Service must be between 2 and 100 characters")
    @Indexed
    private String service;
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @Builder.Default
    private Boolean approved = false;
    
    @Builder.Default
    private Boolean featured = false;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    public String getFormattedDate() {
        return date.toString();
    }
    
    public String getStars() {
        if (rating == null) return "";
        return "★".repeat(rating) + "☆".repeat(5 - rating);
    }
} 