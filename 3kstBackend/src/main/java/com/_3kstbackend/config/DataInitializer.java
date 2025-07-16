package com._3kstbackend.config;

import com._3kstbackend.model.Product;
import com._3kstbackend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only initialize if no products exist
        if (productRepository.count() == 0) {
            initializeProducts();
        }
    }

    private void initializeProducts() {
        Product[] sampleProducts = {
            Product.builder()
                .name("Eco-Friendly Hair Oil")
                .description("Natural hair oil for all hair types, made with organic ingredients")
                .price(new BigDecimal("25000"))
                .category("Hair Care")
                .rating(4.8)
                .reviews(124)
                .ecoFriendly(true)
                .imageUrl("https://images.unsplash.com/photo-1556228720-195a672e8a03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(50)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Product.builder()
                .name("Professional Hair Brush")
                .description("Gentle detangling brush for all hair types")
                .price(new BigDecimal("35000"))
                .category("Styling Tools")
                .rating(4.9)
                .reviews(89)
                .ecoFriendly(true)
                .imageUrl("https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(30)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Product.builder()
                .name("Natural Hair Mask")
                .description("Deep conditioning treatment for damaged hair")
                .price(new BigDecimal("45000"))
                .category("Hair Care")
                .rating(4.7)
                .reviews(156)
                .ecoFriendly(true)
                .imageUrl("https://images.unsplash.com/photo-1522338242992-e1a54906a8da?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(25)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Product.builder()
                .name("Styling Gel")
                .description("Strong hold gel for defined styles")
                .price(new BigDecimal("20000"))
                .category("Styling")
                .rating(4.6)
                .reviews(203)
                .ecoFriendly(false)
                .imageUrl("https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(40)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Product.builder()
                .name("Hair Clips Set")
                .description("Professional hair clips for styling")
                .price(new BigDecimal("15000"))
                .category("Styling Tools")
                .rating(4.5)
                .reviews(78)
                .ecoFriendly(true)
                .imageUrl("https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(60)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build(),

            Product.builder()
                .name("Heat Protectant Spray")
                .description("Protects hair from heat damage")
                .price(new BigDecimal("30000"))
                .category("Hair Care")
                .rating(4.8)
                .reviews(142)
                .ecoFriendly(true)
                .imageUrl("https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80")
                .active(true)
                .stockQuantity(35)
                .available(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build()
        };

        productRepository.saveAll(Arrays.asList(sampleProducts));
        System.out.println("Sample products initialized successfully!");
    }
} 