package com._3kstbackend.repository;

import com._3kstbackend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByEcoFriendlyTrue();
    List<Product> findByAvailableTrue();
} 