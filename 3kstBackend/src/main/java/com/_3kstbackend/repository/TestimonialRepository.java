package com._3kstbackend.repository;

import com._3kstbackend.model.Testimonial;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TestimonialRepository extends MongoRepository<Testimonial, String> {
    List<Testimonial> findByApprovedTrue();
    List<Testimonial> findByFeaturedTrue();
} 