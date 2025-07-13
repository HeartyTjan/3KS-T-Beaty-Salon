package com._3kstbackend.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {

    @Test
    void testProductBuilder() {
        Product product = Product.builder()
                .name("Eco-Friendly Hair Oil")
                .description("Natural hair oil for all hair types")
                .price(new BigDecimal("25000"))
                .category("Hair Care")
                .rating(4.8)
                .reviews(124)
                .ecoFriendly(true)
                .imageUrl("https://example.com/image.jpg")
                .blobId("blob123")
                .active(true)
                .stockQuantity(50)
                .createdAt(LocalDateTime.now())
                .build();

        assertNotNull(product);
        assertEquals("Eco-Friendly Hair Oil", product.getName());
        assertEquals("Natural hair oil for all hair types", product.getDescription());
        assertEquals(new BigDecimal("25000"), product.getPrice());
        assertEquals("Hair Care", product.getCategory());
        assertEquals(4.8, product.getRating());
        assertEquals(124, product.getReviews());
        assertTrue(product.getEcoFriendly());
        assertEquals("https://example.com/image.jpg", product.getImageUrl());
        assertEquals("blob123", product.getBlobId());
        assertTrue(product.getActive());
        assertEquals(50, product.getStockQuantity());
        assertNotNull(product.getCreatedAt());
    }

    @Test
    void testDefaultValues() {
        Product product = new Product();

        assertEquals(0.0, product.getRating());
        assertEquals(0, product.getReviews());
        assertFalse(product.getEcoFriendly());
        assertTrue(product.getActive());
        assertEquals(0, product.getStockQuantity());
    }

    @Test
    void testIncrementReviews() {
        Product product = Product.builder()
                .name("Test Product")
                .description("Test description")
                .price(new BigDecimal("100"))
                .category("Test")
                .reviews(10)
                .build();

        assertEquals(10, product.getReviews());
        product.incrementReviews();
        assertEquals(11, product.getReviews());
    }

    @Test
    void testUpdateRating() {
        Product product = Product.builder()
                .name("Test Product")
                .description("Test description")
                .price(new BigDecimal("100"))
                .category("Test")
                .rating(4.0)
                .reviews(2)
                .build();

        // First rating
        product.updateRating(5.0);
        // ((4.0 * 2) + 5.0) / (2 + 1) = 13 / 3 = 4.333...
        assertEquals(4.333333333333333, product.getRating(), 0.0001);
        assertEquals(3, product.getReviews());

        // Second rating
        product.updateRating(3.0);
        // ((4.333... * 3) + 3.0) / (3 + 1) = (13 + 3) / 4 = 16 / 4 = 4.0
        assertEquals(4.0, product.getRating(), 0.0001);
        assertEquals(4, product.getReviews());
    }

    @Test
    void testUpdateRatingFirstTime() {
        Product product = Product.builder()
                .name("Test Product")
                .description("Test description")
                .price(new BigDecimal("100"))
                .category("Test")
                .rating(0.0)
                .reviews(0)
                .build();

        product.updateRating(4.5);
        assertEquals(4.5, product.getRating());
        assertEquals(1, product.getReviews());
    }
}