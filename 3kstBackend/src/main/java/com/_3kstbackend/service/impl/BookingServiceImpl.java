package com._3kstbackend.service.impl;

import com._3kstbackend.model.Booking;
import com._3kstbackend.dto.BookingRequestDto;
import com._3kstbackend.repository.BookingRepository;
import com._3kstbackend.service.BookingService;
import com._3kstbackend.service.EmailService;
import com._3kstbackend.utils.DateTimeUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    @Autowired
    public BookingServiceImpl(BookingRepository bookingRepository, EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Override
    public Booking createBooking(Booking booking) {
        booking.setId(null);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        Booking savedBooking = bookingRepository.save(booking);
        sendBookingConfirmationEmail(savedBooking);
        return savedBooking;
    }

    @Override
    public Booking createGuestBooking(BookingRequestDto bookingRequest) {
        Booking booking = Booking.builder()
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
                .status(Booking.BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);
        
        // Send confirmation email
        sendBookingConfirmationEmail(savedBooking);
        
        return savedBooking;
    }

    @Override
    public Booking updateBooking(String id, Booking booking) {
        Optional<Booking> existing = bookingRepository.findById(id);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }
        booking.setId(id);
        booking.setCreatedAt(existing.get().getCreatedAt());
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public Booking cancelBooking(String id) {
        Optional<Booking> existing = bookingRepository.findById(id);
        if (existing.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }
        
        Booking booking = existing.get();
        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }

    @Override
    public Optional<Booking> getBookingById(String id) {
        return bookingRepository.findById(id);
    }

    @Override
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    @Override
    public List<Booking> getBookingsByServiceId(String serviceId) {
        return bookingRepository.findByServiceId(serviceId);
    }

    @Override
    public List<Booking> getBookingsByCustomerEmail(String customerEmail) {
        return bookingRepository.findByCustomerEmail(customerEmail);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public Booking linkGuestBookingToUser(String bookingId, String userId) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isEmpty()) {
            throw new IllegalArgumentException("Booking not found");
        }
        
        Booking booking = bookingOpt.get();
        if (!booking.isGuestBooking()) {
            throw new IllegalArgumentException("Booking is not a guest booking");
        }
        
        booking.setUserId(userId);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> linkAllGuestBookingsToUser(String customerEmail, String userId) {
        List<Booking> guestBookings = bookingRepository.findByCustomerEmailAndUserIdIsNull(customerEmail);
        
        for (Booking booking : guestBookings) {
            booking.setUserId(userId);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);
        }
        
        return guestBookings;
    }

    private void sendBookingConfirmationEmail(Booking booking) {
        String subject = "Booking Confirmation - 3KS&T";
        String body = String.format(
                """
                <html>
                    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                        <div style="max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 8px;">
                            <h2 style="color: #5c67f2;">Booking Confirmation</h2>
                            
                            <p>Dear %s,</p>
                            
                            <p>Thank you for booking with <strong>3KS&T</strong>! Your appointment has been confirmed. 🎉</p>
                            
                            <table style="width: 100%%; border-collapse: collapse; margin-top: 20px;">
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">Service:</td>
                                    <td style="padding: 8px;">%s</td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 8px; font-weight: bold;">Date:</td>
                                    <td style="padding: 8px;">%s</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; font-weight: bold;">Time:</td>
                                    <td style="padding: 8px;">%s</td>
                                </tr>
                                <tr style="background-color: #f9f9f9;">
                                    <td style="padding: 8px; font-weight: bold;">Location:</td>
                                    <td style="padding: 8px;">%s service</td>
                                </tr>
                            </table>
        
                            <p style="margin-top: 30px;">We're excited to make you shine! 🌟</p>
        
                            <p style="margin-top: 40px;">Best regards,<br><strong>The 3KS&T Team</strong></p>
                        </div>
                    </body>
                </html>
                """,
                booking.getCustomerName(),
                booking.getServiceTitle(),
                DateTimeUtils.formatEmailDate(booking.getBookingDateTime()),
                DateTimeUtils.formatEmailTime(booking.getBookingDateTime()),
                booking.getIsHomeService() ? "home" : "salon"
        );

        emailService.sendEmail(booking.getCustomerEmail(), subject, body);
    }
}