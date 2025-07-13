package com._3kstbackend.service;

import com._3kstbackend.model.Product;
import com._3kstbackend.repository.ProductRepository;
import com._3kstbackend.service.impl.ProductServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {
    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateProduct() {
        Product product = Product.builder().name("Test").description("desc").price(BigDecimal.TEN).category("Cat").build();
        when(productRepository.save(product)).thenReturn(product);
        Product saved = productService.createProduct(product);
        assertEquals(product, saved);
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void testGetProductById() {
        Product product = Product.builder().id("1").name("Test").build();
        when(productRepository.findById("1")).thenReturn(Optional.of(product));
        Optional<Product> found = productService.getProductById("1");
        assertTrue(found.isPresent());
        assertEquals("Test", found.get().getName());
    }

    @Test
    void testGetAllProducts() {
        List<Product> products = Arrays.asList(
                Product.builder().id("1").name("A").build(),
                Product.builder().id("2").name("B").build()
        );
        when(productRepository.findAll()).thenReturn(products);
        List<Product> all = productService.getAllProducts();
        assertEquals(2, all.size());
    }

    @Test
    void testDeleteProduct() {
        productService.deleteProduct("1");
        verify(productRepository, times(1)).deleteById("1");
    }
}