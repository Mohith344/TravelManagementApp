package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.DTO.BookingDTO;
import com.example.travelmanagementapp.model.Booking;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TravelPackageRepository travelPackageRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            // Get the user
            Optional<User> userOpt = userRepository.findById(bookingDTO.getUserId());
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Get the travel package
            Optional<TravelPackage> packageOpt = travelPackageRepository.findById(bookingDTO.getTravelPackageId());
            if (!packageOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Travel package not found");
            }
            
            // Create booking entity
            Booking booking = new Booking();
            booking.setUser(userOpt.get());
            booking.setTravelPackage(packageOpt.get());
            booking.setBookingDate(LocalDate.now()); // Set booking date to current date
            booking.setTravelDate(LocalDate.parse(bookingDTO.getTravelDate())); // Parse the string date
            booking.setTotalPrice(bookingDTO.getTotalPrice());
            
            // Save booking
            Booking savedBooking = bookingService.createBooking(booking);
            
            return ResponseEntity.ok(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Optional<Booking> booking = bookingService.getBookingById(id);
            if (booking.isPresent()) {
                return ResponseEntity.ok(booking.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching booking: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok("Booking cancelled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling booking: " + e.getMessage());
        }
    }
}