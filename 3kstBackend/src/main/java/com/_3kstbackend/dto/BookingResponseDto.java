package com._3kstbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com._3kstbackend.model.Booking;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponseDto {
    
    private String id;
    private String userId;
    private String serviceId;
    private String serviceTitle;
    private LocalDateTime bookingDateTime;
    private Integer durationMinutes;
    private BigDecimal price;
    private Booking.BookingStatus status;
    private String notes;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String address;
    private Boolean isHomeService;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime confirmedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    private String cancellationReason;
    private Boolean isGuestBooking;
    
    public static BookingResponseDto fromBooking(Booking booking) {
        return BookingResponseDto.builder()
                .id(booking.getId())
                .userId(booking.getUserId())
                .serviceId(booking.getServiceId())
                .serviceTitle(booking.getServiceTitle())
                .bookingDateTime(booking.getBookingDateTime())
                .durationMinutes(booking.getDurationMinutes())
                .price(booking.getPrice())
                .status(booking.getStatus())
                .notes(booking.getNotes())
                .customerName(booking.getCustomerName())
                .customerPhone(booking.getCustomerPhone())
                .customerEmail(booking.getCustomerEmail())
                .address(booking.getAddress())
                .isHomeService(booking.getIsHomeService())
                .createdAt(booking.getCreatedAt())
                .updatedAt(booking.getUpdatedAt())
                .confirmedAt(booking.getConfirmedAt())
                .completedAt(booking.getCompletedAt())
                .cancelledAt(booking.getCancelledAt())
                .cancellationReason(booking.getCancellationReason())
                .isGuestBooking(booking.isGuestBooking())
                .build();
    }
} 