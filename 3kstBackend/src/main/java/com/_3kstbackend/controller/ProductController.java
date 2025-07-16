package com._3kstbackend.controller;

import com._3kstbackend.model.Product;
import com._3kstbackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // GET /api/products - Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // GET /api/products/{id} - Get product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/products - Create new product
    @PostMapping
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody Product product) {
        product.setId(null); // Ensure new product
        Product createdProduct = productService.createProduct(product);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", createdProduct);
        response.put("message", "Product created successfully");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // PUT /api/products/{id} - Update product
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(@PathVariable String id, @RequestBody Product product) {
        product.setId(id);
        Product updatedProduct = productService.updateProduct(id, product);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", updatedProduct);
        response.put("message", "Product updated successfully");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // DELETE /api/products/{id} - Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", null);
        response.put("message", "Product deleted successfully");
        response.put("timestamp", LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    // GET /api/products/available - Get available products
    @GetMapping("/available")
    public ResponseEntity<List<Product>> getAvailableProducts() {
        List<Product> availableProducts = productService.getAvailableProducts();
        return ResponseEntity.ok(availableProducts);
    }

    // GET /api/products/category/{category} - Get products by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        List<Product> products = productService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    // GET /api/products/search - Search products
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String query) {
        List<Product> products = productService.getAllProducts(); // For now, return all products
        // TODO: Implement actual search functionality
        return ResponseEntity.ok(products);
    }

    // GET /api/products/count - Get total product count
    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getProductCount() {
        int count = productService.getAllProducts().size();
        Map<String, Integer> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }
} 