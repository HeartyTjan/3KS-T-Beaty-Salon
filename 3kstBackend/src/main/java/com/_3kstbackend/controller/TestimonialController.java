package com._3kstbackend.controller;

import com._3kstbackend.model.Testimonial;
import com._3kstbackend.service.TestimonialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
public class TestimonialController {
    private final TestimonialService testimonialService;

    @Autowired
    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    // Allow users to post testimonials
    @PostMapping
    public ResponseEntity<Testimonial> createTestimonial(@RequestBody Testimonial testimonial) {
        Testimonial created = testimonialService.createTestimonial(testimonial);
        return ResponseEntity.ok(created);
    }

    // Public: get all testimonials (optionally only approved)
    @GetMapping
    public ResponseEntity<List<Testimonial>> getAllTestimonials(@RequestParam(value = "approved", required = false) Boolean approved) {
        List<Testimonial> testimonials = (approved != null && approved)
                ? testimonialService.getApprovedTestimonials()
                : testimonialService.getAllTestimonials();
        return ResponseEntity.ok(testimonials);
    }

    // Public: get featured testimonials
    @GetMapping("/featured")
    public ResponseEntity<List<Testimonial>> getFeaturedTestimonials() {
        return ResponseEntity.ok(testimonialService.getFeaturedTestimonials());
    }

    // Admin only: delete testimonial
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTestimonial(@PathVariable String id) {
        testimonialService.deleteTestimonial(id);
        return ResponseEntity.noContent().build();
    }
} 