package com._3kstbackend.service.impl;

import com._3kstbackend.model.Testimonial;
import com._3kstbackend.repository.TestimonialRepository;
import com._3kstbackend.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonialServiceImpl implements TestimonialService {
    private final TestimonialRepository testimonialRepository;

    @Autowired
    public TestimonialServiceImpl(TestimonialRepository testimonialRepository) {
        this.testimonialRepository = testimonialRepository;
    }

    @Override
    public Testimonial createTestimonial(Testimonial testimonial) {
        testimonial.setId(null); // Let MongoDB generate the ID
        testimonial.setApproved(false); // Default: not approved
        testimonial.setFeatured(false); // Default: not featured
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

    @Override
    public List<Testimonial> getAllTestimonials() {
        return testimonialRepository.findAll();
    }

    @Override
    public List<Testimonial> getApprovedTestimonials() {
        return testimonialRepository.findByApprovedTrue();
    }

    @Override
    public List<Testimonial> getFeaturedTestimonials() {
        return testimonialRepository.findByFeaturedTrue();
    }

    @Override
    public Testimonial updateTestimonial(String id, Testimonial testimonial) {
        throw new UnsupportedOperationException("Updating testimonials is not supported.");
    }
} 