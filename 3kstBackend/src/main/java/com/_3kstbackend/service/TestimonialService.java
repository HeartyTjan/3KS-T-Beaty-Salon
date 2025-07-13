package com._3kstbackend.service;

import com._3kstbackend.model.Testimonial;
import java.util.List;
import java.util.Optional;

public interface TestimonialService {
    Testimonial createTestimonial(Testimonial testimonial);
    Testimonial updateTestimonial(String id, Testimonial testimonial);
    void deleteTestimonial(String id);
    Optional<Testimonial> getTestimonialById(String id);
    List<Testimonial> getAllTestimonials();
    List<Testimonial> getApprovedTestimonials();
    List<Testimonial> getFeaturedTestimonials();
} 