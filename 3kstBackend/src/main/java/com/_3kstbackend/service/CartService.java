package com._3kstbackend.service;

import com._3kstbackend.model.Cart;
import java.util.Optional;

public interface CartService {
    Cart createCart(Cart cart);
    Cart updateCart(String id, Cart cart);
    void deleteCart(String id);
    Optional<Cart> getCartById(String id);
    Optional<Cart> getCartByUserId(String userId);
    void clearCart(String userId);
    Cart addToCart(String userId, String productId, Integer quantity);
    Cart removeFromCart(String userId, String productId);
    Cart updateCartItem(String userId, String productId, Integer quantity);
} 