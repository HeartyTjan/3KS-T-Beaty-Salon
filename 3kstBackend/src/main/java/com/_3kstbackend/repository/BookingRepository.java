package com._3kstbackend.repository;

import com._3kstbackend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByServiceId(String serviceId);
    List<Booking> findByCustomerEmail(String customerEmail);
    
    @Query("{'customerEmail': ?0, 'userId': {$exists: false}}")
    List<Booking> findByCustomerEmailAndUserIdIsNull(String customerEmail);
} 