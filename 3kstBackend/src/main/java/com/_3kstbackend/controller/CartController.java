package com._3kstbackend.controller;

import com._3kstbackend.model.Cart;
import com._3kstbackend.model.CartItem;
import com._3kstbackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // GET /api/cart?userId=...
    @GetMapping
    public ResponseEntity<Cart> getCartByUserId(@RequestParam String userId) {
        return cartService.getCartByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/cart/add
    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String productId = (String) payload.get("productId");
        Integer quantity = (Integer) payload.get("quantity");
        Cart updatedCart = cartService.addToCart(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // DELETE /api/cart/remove
    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeFromCart(@RequestParam String userId, @RequestParam String productId) {
        Cart updatedCart = cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok(updatedCart);
    }

    // PUT /api/cart/update
    @PutMapping("/update")
    public ResponseEntity<Cart> updateCartItem(@RequestBody Map<String, Object> payload) {
        String userId = (String) payload.get("userId");
        String productId = (String) payload.get("productId");
        Integer quantity = (Integer) payload.get("quantity");
        Cart updatedCart = cartService.updateCartItem(userId, productId, quantity);
        return ResponseEntity.ok(updatedCart);
    }

    // DELETE /api/cart/clear
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@RequestParam String userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
} 