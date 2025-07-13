package com._3kstbackend.service;

import com._3kstbackend.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    Product createProduct(Product product);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id);
    Optional<Product> getProductById(String id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getEcoFriendlyProducts();
    List<Product> getAvailableProducts();
} 