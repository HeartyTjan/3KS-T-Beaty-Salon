package com._3kstbackend.service;

import com._3kstbackend.model.Order;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Order order);
    Order updateOrder(String id, Order order);
    void deleteOrder(String id);
    Optional<Order> getOrderById(String id);
    Optional<Order> getOrderByOrderNumber(String orderNumber);
    List<Order> getOrdersByUserId(String userId);
    List<Order> getAllOrders();
} 