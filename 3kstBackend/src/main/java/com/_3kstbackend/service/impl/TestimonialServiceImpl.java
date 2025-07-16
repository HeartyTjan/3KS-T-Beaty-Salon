package com._3kstbackend.service.impl;

import com._3kstbackend.model.Testimonial;
import com._3kstbackend.repository.TestimonialRepository;
import com._3kstbackend.service.TestimonialService;
import com._3kstbackend.repository.UserRepository;
import com._3kstbackend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonialServiceImpl implements TestimonialService {
    private final TestimonialRepository testimonialRepository;
    private final UserRepository userRepository;

    @Autowired
    public TestimonialServiceImpl(TestimonialRepository testimonialRepository, UserRepository userRepository) {
        this.testimonialRepository = testimonialRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Testimonial createTestimonial(Testimonial testimonial) {
        // If testimonial has a userId but no name, look up the user and set the name
        if ((testimonial.getName() == null || testimonial.getName().isBlank()) && testimonial.getUserId() != null) {
            userRepository.findById(testimonial.getUserId()).ifPresent(user -> testimonial.setName(user.getFullName()));
        }
        testimonial.setApproved(true); 
        testimonial.setFeatured(true); 
        if (testimonial.getDate() == null) {
            testimonial.setDate(LocalDate.now());
        }
        testimonial.setCreatedAt(LocalDateTime.now());
        testimonial.setUpdatedAt(LocalDateTime.now());
        return testimonialRepository.save(testimonial);
    }

    @Override
    public void deleteTestimonial(String id) {
        testimonialRepository.deleteById(id);
    }

    @Override
    public Optional<Testimonial> getTestimonialById(String id) {
        return testimonialRepository.findById(id);
    }

    private boolean isValid(Testimonial t) {
        return t != null && t.getDate() != null;
    }

    @Override
    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll().stream()
                .filter(this::isValid)
                .toList();
    }

    @Override
    public List<Testimonial> getApprovedTestimonials() {
        return testimonialRepository.findByApprovedTrue().stream()
                .filter(this::isValid)
                .toList();
    }

    @Override
    public List<Testimonial> getFeaturedTestimonials() {
        return testimonialRepository.findByFeaturedTrue().stream()
                .filter(this::isValid)
                .toList();
    }

    @Override
    public Testimonial updateTestimonial(String id, Testimonial testimonial) {
        throw new UnsupportedOperationException("Updating testimonials is not supported.");
    }
} 