package com._3kstbackend.controller;

import com._3kstbackend.model.Booking;
import com._3kstbackend.dto.BookingRequestDto;
import com._3kstbackend.dto.BookingResponseDto;
import com._3kstbackend.service.BookingService;
import com._3kstbackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;
    private final UserService userService;

    @Autowired
    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
    }

    @PostMapping("/guest")
    public ResponseEntity<?> createGuestBooking(@Valid @RequestBody BookingRequestDto bookingRequest) {
        System.out.println("Guest booking request received: " + bookingRequest);
        try {
            Booking booking = bookingService.createGuestBooking(bookingRequest);
            System.out.println("Guest booking created successfully: " + booking.getId());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(BookingResponseDto.fromBooking(booking));
        } catch (Exception e) {
            System.err.println("Error creating guest booking: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body("Error creating booking: " + e.getMessage());
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDto> createBooking(@Valid @RequestBody BookingRequestDto bookingRequest) {
        try {
            Booking booking = Booking.builder()
                    .userId(bookingRequest.getUserId())
                    .serviceId(bookingRequest.getServiceId())
                    .serviceTitle(bookingRequest.getServiceTitle())
                    .bookingDateTime(bookingRequest.getBookingDateTime())
                    .durationMinutes(bookingRequest.getDurationMinutes())
                    .notes(bookingRequest.getNotes())
                    .customerName(bookingRequest.getCustomerName())
                    .customerPhone(bookingRequest.getCustomerPhone())
                    .customerEmail(bookingRequest.getCustomerEmail())
                    .address(bookingRequest.getAddress())
                    .isHomeService(bookingRequest.getIsHomeService())
                    .build();

            Booking savedBooking = bookingService.createBooking(booking);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(BookingResponseDto.fromBooking(savedBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDto> getBookingById(@PathVariable String id) {
        return bookingService.getBookingById(id)
                .map(booking -> ResponseEntity.ok(BookingResponseDto.fromBooking(booking)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByUserId(@PathVariable String userId) {
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        List<BookingResponseDto> response = bookings.stream()
                .map(BookingResponseDto::fromBooking)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByEmail(@PathVariable String email) {
        List<Booking> bookings = bookingService.getBookingsByCustomerEmail(email);
        List<BookingResponseDto> response = bookings.stream()
                .map(BookingResponseDto::fromBooking)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        List<BookingResponseDto> response = bookings.stream()
                .map(BookingResponseDto::fromBooking)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDto> updateBooking(@PathVariable String id, @Valid @RequestBody BookingRequestDto bookingRequest) {
        try {
            Booking booking = Booking.builder()
                    .id(id)
                    .userId(bookingRequest.getUserId())
                    .serviceId(bookingRequest.getServiceId())
                    .serviceTitle(bookingRequest.getServiceTitle())
                    .bookingDateTime(bookingRequest.getBookingDateTime())
                    .durationMinutes(bookingRequest.getDurationMinutes())
                    .notes(bookingRequest.getNotes())
                    .customerName(bookingRequest.getCustomerName())
                    .customerPhone(bookingRequest.getCustomerPhone())
                    .customerEmail(bookingRequest.getCustomerEmail())
                    .address(bookingRequest.getAddress())
                    .isHomeService(bookingRequest.getIsHomeService())
                    .build();

            Booking updatedBooking = bookingService.updateBooking(id, booking);
            return ResponseEntity.ok(BookingResponseDto.fromBooking(updatedBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBooking(@PathVariable String id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDto> cancelBooking(@PathVariable String id) {
        try {
            Booking cancelledBooking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(BookingResponseDto.fromBooking(cancelledBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/link")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BookingResponseDto> linkGuestBookingToUser(@PathVariable String id, @RequestParam String userId) {
        try {
            Booking linkedBooking = bookingService.linkGuestBookingToUser(id, userId);
            return ResponseEntity.ok(BookingResponseDto.fromBooking(linkedBooking));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/link-all")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingResponseDto>> linkAllGuestBookingsToUser(@RequestParam String email, @RequestParam String userId) {
        try {
            List<Booking> linkedBookings = bookingService.linkAllGuestBookingsToUser(email, userId);
            List<BookingResponseDto> response = linkedBookings.stream()
                    .map(BookingResponseDto::fromBooking)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 