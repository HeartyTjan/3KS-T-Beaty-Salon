package com._3kstbackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.validation.constraints.Positive;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "services")
public class ServiceModel {
    
    @Id
    private String id;
    
    @NotBlank(message = "Service title is required")
    @Size(min = 2, max = 100, message = "Service title must be between 2 and 100 characters")
    @Indexed
    private String title;
    
    @NotBlank(message = "Service description is required")
    @Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters")
    private String description;
    
    private String price; 
 
    private String duration; 
    
    @NotEmpty(message = "At least one feature is required")
    private List<@NotBlank(message = "Feature cannot be blank") String> features;
    
    private String imageUrl;
        
    @Builder.Default
    private Boolean active = true;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // Helper methods
    public String getFormattedDuration() {
        return duration;
    }
    
    public String getFormattedPrice() {
        return price;
    }
} 