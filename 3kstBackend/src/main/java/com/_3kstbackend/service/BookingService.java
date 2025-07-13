package com._3kstbackend.service;

import com._3kstbackend.model.Booking;
import com._3kstbackend.dto.BookingRequestDto;
import java.util.List;
import java.util.Optional;

public interface BookingService {
    Booking createBooking(Booking booking);
    Booking createGuestBooking(BookingRequestDto bookingRequest);
    Booking updateBooking(String id, Booking booking);
    Booking cancelBooking(String id);
    void deleteBooking(String id);
    Optional<Booking> getBookingById(String id);
    List<Booking> getBookingsByUserId(String userId);
    List<Booking> getBookingsByServiceId(String serviceId);
    List<Booking> getBookingsByCustomerEmail(String customerEmail);
    List<Booking> getAllBookings();
    Booking linkGuestBookingToUser(String bookingId, String userId);
    List<Booking> linkAllGuestBookingsToUser(String customerEmail, String userId);
} 