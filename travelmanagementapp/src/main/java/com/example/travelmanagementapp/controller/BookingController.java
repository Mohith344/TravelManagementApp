package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.DTO.BookingDTO;
import com.example.travelmanagementapp.DTO.DestinationBookingDTO;
import com.example.travelmanagementapp.model.Booking;
import com.example.travelmanagementapp.model.Destination;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.DestinationRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TravelPackageRepository travelPackageRepository;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO) {
        try {
            // Get the user - try by ID first, then by username if ID is null or not found
            User user = null;
            if (bookingDTO.getUserId() != null) {
                Optional<User> userOpt = userRepository.findById(bookingDTO.getUserId());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                }
            }
            
            // If user not found by ID and username is provided, try by username
            if (user == null && bookingDTO.getUsername() != null && !bookingDTO.getUsername().isEmpty()) {
                Optional<User> userOpt = userRepository.findByUsername(bookingDTO.getUsername());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                }
            }
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Check if user has TRAVELLER role
            if (!"TRAVELLER".equals(user.getRole()) && !"ROLE_TRAVELLER".equals(user.getRole())) {
                return ResponseEntity.status(403).body("Only travelers can create bookings");
            }
            
            // Get the travel package
            Optional<TravelPackage> packageOpt = travelPackageRepository.findById(bookingDTO.getTravelPackageId());
            if (!packageOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Travel package not found");
            }
            
            // Create booking entity
            Booking booking = new Booking();
            booking.setBookingDate(LocalDate.now());
            booking.setTravelDate(LocalDate.parse(bookingDTO.getTravelDate()));
            booking.setTotalPrice(bookingDTO.getTotalPrice());
            booking.setUser(user);
            booking.setTravelPackage(packageOpt.get());
            
            // Save booking
            Booking savedBooking = bookingService.createBooking(booking);
            
            // Return success response with booking id
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedBooking.getId());
            response.put("status", "success");
            response.put("message", "Booking created successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating booking: " + e.getMessage());
        }
    }
    
    @PostMapping("/destination")
    public ResponseEntity<?> createDestinationBooking(@RequestBody DestinationBookingDTO bookingDTO) {
        try {
            // Get the user - try by ID first, then by username if ID is null or not found
            User user = null;
            if (bookingDTO.getUserId() != null) {
                Optional<User> userOpt = userRepository.findById(bookingDTO.getUserId());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                }
            }
            
            // If user not found by ID and username is provided, try by username
            if (user == null && bookingDTO.getUsername() != null && !bookingDTO.getUsername().isEmpty()) {
                Optional<User> userOpt = userRepository.findByUsername(bookingDTO.getUsername());
                if (userOpt.isPresent()) {
                    user = userOpt.get();
                }
            }
            
            if (user == null) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            // Check if user has TRAVELLER role
            if (!"TRAVELLER".equals(user.getRole()) && !"ROLE_TRAVELLER".equals(user.getRole())) {
                return ResponseEntity.status(403).body("Only travelers can create bookings");
            }
            
            // Get the hotel
            Optional<Hotel> hotelOpt = hotelRepository.findById(bookingDTO.getHotelId());
            if (!hotelOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Hotel not found");
            }
            
            // Get the destination
            Optional<Destination> destinationOpt = destinationRepository.findById(bookingDTO.getDestinationId());
            if (!destinationOpt.isPresent()) {
                return ResponseEntity.badRequest().body("Destination not found");
            }
            
            // Create booking entity
            Booking booking = new Booking();
            booking.setBookingDate(LocalDate.now());
            booking.setTravelDate(LocalDate.parse(bookingDTO.getTravelDate()));
            booking.setTotalPrice(bookingDTO.getTotalPrice());
            booking.setUser(user);
            
            // For destination bookings, we create a special "virtual" travel package that
            // represents this specific hotel + destination combination
            TravelPackage virtualPackage = new TravelPackage();
            // Personalize the package name to include the user's identifier
            virtualPackage.setName("My Trip to " + destinationOpt.get().getName());
            virtualPackage.setDescription("Hotel: " + hotelOpt.get().getName());
            virtualPackage.setPrice(bookingDTO.getTotalPrice());
            
            // Set a default travel agency name to avoid null constraint violation
            virtualPackage.setTravelAgencyName("Destination Direct Booking");
            
            // Set the user who created this virtual package
            virtualPackage.setUser(user);
            // Flag this as a private destination booking package, not a public package
            virtualPackage.setIsPersonalBooking(true);
            
            // Save the virtual package
            virtualPackage = travelPackageRepository.save(virtualPackage);
            
            booking.setTravelPackage(virtualPackage);
            
            // Save booking
            Booking savedBooking = bookingService.createBooking(booking);
            
            // Return success response with booking id
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedBooking.getId());
            response.put("status", "success");
            response.put("message", "Destination booking created successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating destination booking: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        try {
            // Validate user exists
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            List<Booking> bookings = bookingService.getBookingsByUserId(userId);
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }
    
    @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserBookingsByUsername(@PathVariable String username) {
        try {
            // Validate user exists
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOpt.get();
            List<Booking> bookings = bookingService.getBookingsByUserId(user.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching bookings: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        try {
            Optional<Booking> bookingOpt = bookingService.getBookingById(id);
            if (!bookingOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(bookingOpt.get());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching booking: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            Optional<Booking> bookingOpt = bookingService.getBookingById(id);
            if (!bookingOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }
            
            bookingService.cancelBooking(id);
            return ResponseEntity.ok().body(Map.of("status", "success", "message", "Booking cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error cancelling booking: " + e.getMessage());
        }
    }
    
    @GetMapping("/packages")
    public ResponseEntity<?> getAvailablePackagesForBooking() {
        try {
            List<TravelPackage> packages = travelPackageRepository.findAll();
            List<Map<String, Object>> result = packages.stream().map(pkg -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", pkg.getId());
                map.put("name", pkg.getName());
                map.put("description", pkg.getDescription());
                map.put("price", pkg.getPrice());
                map.put("travelAgencyName", pkg.getTravelAgencyName());
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching packages: " + e.getMessage());
        }
    }
    
    @GetMapping("/validate-user-role/{userId}")
    public ResponseEntity<?> validateUserBookingPermission(@PathVariable Long userId) {
        try {
            Optional<User> userOpt = userRepository.findById(userId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.badRequest().body("User not found");
            }
            
            User user = userOpt.get();
            boolean canBook = "TRAVELLER".equals(user.getRole()) || "ROLE_TRAVELLER".equals(user.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("canBook", canBook);
            response.put("role", user.getRole());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error validating user: " + e.getMessage());
        }
    }
}