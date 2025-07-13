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
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {
    
    @Id
    private String id;
    
    @NotBlank(message = "User ID is required")
    @Indexed
    private String userId;
    
    @NotBlank(message = "Order number is required")
    @Indexed(unique = true)
    private String orderNumber;
    
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
    
    @NotNull(message = "Subtotal is required")
    @Positive(message = "Subtotal must be positive")
    private BigDecimal subtotal;
    
    @Builder.Default
    private BigDecimal tax = BigDecimal.ZERO;
    
    @Builder.Default
    private BigDecimal shipping = BigDecimal.ZERO;
    
    @NotNull(message = "Total is required")
    @Positive(message = "Total must be positive")
    private BigDecimal total;
    
    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;
    
    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;
    
    private String shippingAddress;
    
    private String billingAddress;
    
    private String customerName;
    
    private String customerPhone;
    
    private String customerEmail;
    
    private String notes;
    
    private String trackingNumber;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    private LocalDateTime paidAt;
    
    private LocalDateTime shippedAt;
    
    private LocalDateTime deliveredAt;
    
    private LocalDateTime cancelledAt;
    
    private String cancellationReason;
    
    // Helper methods
    public void calculateTotals() {
        this.subtotal = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        this.total = subtotal.add(tax).add(shipping);
    }
    
    public boolean isPaid() {
        return PaymentStatus.PAID.equals(paymentStatus);
    }
    
    public boolean isShipped() {
        return OrderStatus.SHIPPED.equals(status);
    }
    
    public boolean isDelivered() {
        return OrderStatus.DELIVERED.equals(status);
    }
    
    public boolean isCancelled() {
        return OrderStatus.CANCELLED.equals(status);
    }
    
    public enum OrderStatus {
        PENDING,
        CONFIRMED,
        PROCESSING,
        SHIPPED,
        DELIVERED,
        CANCELLED,
        REFUNDED
    }
    
    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        REFUNDED,
        PARTIALLY_REFUNDED
    }
} 