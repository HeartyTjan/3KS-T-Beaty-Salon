package com._3kstbackend.service;

import com._3kstbackend.model.Testimonial;
import com._3kstbackend.repository.TestimonialRepository;
import com._3kstbackend.service.impl.TestimonialServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TestimonialServiceTest {
    @Mock
    private TestimonialRepository testimonialRepository;

    @InjectMocks
    private TestimonialServiceImpl testimonialService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateTestimonialDefaults() {
        Testimonial input = Testimonial.builder()
                .name("User")
                .rating(5)
                .text("Great!")
                .service("Hair")
                .build();
        Testimonial saved = Testimonial.builder()
                .id("1")
                .name("User")
                .rating(5)
                .text("Great!")
                .service("Hair")
                .approved(false)
                .featured(false)
                .date(LocalDate.now())
                .build();
        when(testimonialRepository.save(any(Testimonial.class))).thenReturn(saved);
        Testimonial result = testimonialService.createTestimonial(input);
        assertEquals(saved.getName(), result.getName());
        assertFalse(result.getApproved());
        assertFalse(result.getFeatured());
        assertNotNull(result.getDate());
        verify(testimonialRepository, times(1)).save(any(Testimonial.class));
    }

    @Test
    void testDeleteTestimonial() {
        testimonialService.deleteTestimonial("1");
        verify(testimonialRepository, times(1)).deleteById("1");
    }

    @Test
    void testGetAllTestimonials() {
        List<Testimonial> list = Arrays.asList(
                Testimonial.builder().id("1").build(),
                Testimonial.builder().id("2").build()
        );
        when(testimonialRepository.findAll()).thenReturn(list);
        List<Testimonial> result = testimonialService.getAllTestimonials();
        assertEquals(2, result.size());
    }

    @Test
    void testGetApprovedTestimonials() {
        List<Testimonial> list = List.of(Testimonial.builder().id("1").approved(true).build());
        when(testimonialRepository.findByApprovedTrue()).thenReturn(list);
        List<Testimonial> result = testimonialService.getApprovedTestimonials();
        assertEquals(1, result.size());
        assertTrue(result.get(0).getApproved());
    }

    @Test
    void testGetFeaturedTestimonials() {
        List<Testimonial> list = List.of(Testimonial.builder().id("1").featured(true).build());
        when(testimonialRepository.findByFeaturedTrue()).thenReturn(list);
        List<Testimonial> result = testimonialService.getFeaturedTestimonials();
        assertEquals(1, result.size());
        assertTrue(result.get(0).getFeatured());
    }

    @Test
    void testUpdateTestimonialThrows() {
        assertThrows(UnsupportedOperationException.class, () ->
                testimonialService.updateTestimonial("1", Testimonial.builder().build()));
    }
}