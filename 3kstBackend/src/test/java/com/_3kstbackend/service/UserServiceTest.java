package com._3kstbackend.service;

import com._3kstbackend.model.User;
import com._3kstbackend.repository.UserRepository;
import com._3kstbackend.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private EmailService emailService;
    @Mock
    private BookingService bookingService;
    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        // Stub emailService.sendEmail to do nothing (void method)
        doNothing().when(emailService).sendEmail(anyString(), anyString(), anyString());
        // Stub bookingService.linkAllGuestBookingsToUser to return empty list (returns List<Booking>)
        when(bookingService.linkAllGuestBookingsToUser(anyString(), anyString())).thenReturn(Arrays.asList());
    }

    @Test
    void testCreateUserSuccess() {
        User user = User.builder().email("test@example.com").password("pass").firstName("A").lastName("B").build();
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("pass")).thenReturn("hashed");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        User saved = userService.createUser(user);
        assertEquals("hashed", saved.getPassword());
        assertNotNull(saved.getCreatedAt());
        assertNotNull(saved.getUpdatedAt());
    }

    @Test
    void testCreateUserDuplicateEmail() {
        User user = User.builder().email("test@example.com").password("pass").build();
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        assertThrows(DuplicateKeyException.class, () -> userService.createUser(user));
    }

    @Test
    void testUpdateUserPasswordChanged() {
        User existing = User.builder().id("1").email("a@b.com").password("oldhash").createdAt(LocalDateTime.now()).build();
        User update = User.builder().email("a@b.com").password("newpass").build();
        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("newpass", "oldhash")).thenReturn(false);
        when(passwordEncoder.encode("newpass")).thenReturn("newhash");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        User saved = userService.updateUser("1", update);
        assertEquals("newhash", saved.getPassword());
    }

    @Test
    void testUpdateUserPasswordUnchanged() {
        User existing = User.builder().id("1").email("a@b.com").password("oldhash").createdAt(LocalDateTime.now()).build();
        User update = User.builder().email("a@b.com").password("oldhash").build();
        when(userRepository.findById("1")).thenReturn(Optional.of(existing));
        when(passwordEncoder.matches("oldhash", "oldhash")).thenReturn(true);
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));
        User saved = userService.updateUser("1", update);
        assertEquals("oldhash", saved.getPassword());
    }

    @Test
    void testGetUserById() {
        User user = User.builder().id("1").email("a@b.com").build();
        when(userRepository.findById("1")).thenReturn(Optional.of(user));
        Optional<User> found = userService.getUserById("1");
        assertTrue(found.isPresent());
        assertEquals("a@b.com", found.get().getEmail());
    }

    @Test
    void testGetUserByEmail() {
        User user = User.builder().id("1").email("a@b.com").build();
        when(userRepository.findByEmail("a@b.com")).thenReturn(Optional.of(user));
        Optional<User> found = userService.getUserByEmail("a@b.com");
        assertTrue(found.isPresent());
        assertEquals("1", found.get().getId());
    }

    @Test
    void testDeleteUser() {
        userService.deleteUser("1");
        verify(userRepository, times(1)).deleteById("1");
    }

    @Test
    void testGetAllUsers() {
        List<User> users = Arrays.asList(User.builder().id("1").build(), User.builder().id("2").build());
        when(userRepository.findAll()).thenReturn(users);
        List<User> all = userService.getAllUsers();
        assertEquals(2, all.size());
    }
}