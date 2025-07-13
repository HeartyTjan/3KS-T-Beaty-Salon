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
import jakarta.validation.constraints.Email;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {
    
    @Id
    private String id;
    
    @Indexed
    private String userId; // Optional for guest bookings
    
    @NotBlank(message = "Service ID is required")
    @Indexed
    private String serviceId;
    
    @NotBlank(message = "Service title is required")
    private String serviceTitle;
    
    @NotNull(message = "Booking date and time is required")
    private LocalDateTime bookingDateTime;
    
    @NotNull(message = "Duration is required")
    private Integer durationMinutes;
    
    @NotNull(message = "Price is required")
    private BigDecimal price;
    
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;
    
    private String notes;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    @NotBlank(message = "Customer phone is required")
    private String customerPhone;
    
    @NotBlank(message = "Customer email is required")
    @Email(message = "Invalid email format")
    private String customerEmail;
    
    private String address; // For home service
    
    @Builder.Default
    private Boolean isHomeService = false;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime confirmedAt;
    
    private LocalDateTime completedAt;
    
    private LocalDateTime cancelledAt;
    
    private String cancellationReason;
    
    // Helper methods
    public boolean isConfirmed() {
        return BookingStatus.CONFIRMED.equals(status);
    }
    
    public boolean isCompleted() {
        return BookingStatus.COMPLETED.equals(status);
    }
    
    public boolean isCancelled() {
        return BookingStatus.CANCELLED.equals(status);
    }
    
    public boolean isPending() {
        return BookingStatus.PENDING.equals(status);
    }
    
    public boolean isGuestBooking() {
        return userId == null || userId.isEmpty();
    }
    
    public enum BookingStatus {
        PENDING,
        CONFIRMED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        NO_SHOW
    }
} 