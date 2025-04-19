package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.service.TravelPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
//import com.example.travelmanagementapp.repository.TravelAgencyRepository;
//import com.example.travelmanagementapp.model.TravelAgency;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/travel-packages")
public class TravelPackageController {

    @Autowired
    private TravelPackageService travelPackageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping
    public ResponseEntity<String> createTravelPackage(@RequestBody TravelPackage travelPackage) {
        travelPackageService.createTravelPackage(travelPackage);
        return ResponseEntity.ok("Travel package created successfully");
    }

    @PostMapping("/create")
    public ResponseEntity<String> createTravelPackage(@RequestParam String packageName,
                                                      @RequestParam String destination,
                                                      @RequestParam double price, // Accept price as a parameter
                                                      @RequestParam(required = false) List<String> restaurants,
                                                      @RequestParam(required = false) List<String> hotels,
                                                      @RequestParam(required = false) List<MultipartFile> restaurantImages,
                                                      @RequestParam(required = false) List<MultipartFile> hotelImages,
                                                      @RequestParam String username) { // Accept username as a parameter
        try {
            // Fetch the user from the database
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Ensure the user has the role of TRAVEL_AGENCY
            if (!"TRAVEL_AGENCY".equals(user.getRole())) {
                return ResponseEntity.status(403).body("Only travel agency users can create travel packages");
            }

            // Use the travel_agency_name field from the User entity
            String travelAgencyName = user.getTravelAgencyName();
            if (travelAgencyName == null || travelAgencyName.isEmpty()) {
                return ResponseEntity.status(400).body("Travel agency name is not set for the user");
            }

            travelPackageService.createTravelPackageWithDetails(packageName, destination, price,
                restaurants != null ? restaurants : List.of(),
                hotels != null ? hotels : List.of(),
                restaurantImages != null ? restaurantImages : List.of(),
                hotelImages != null ? hotelImages : List.of(),
                user, travelAgencyName);
            return ResponseEntity.ok("Travel package created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating travel package: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TravelPackage>> getAllTravelPackages() {
        return ResponseEntity.ok(travelPackageService.getAllTravelPackages());
    }
    
    @GetMapping("/user/{username}")
    public ResponseEntity<List<TravelPackage>> getTravelPackagesByUsername(@PathVariable String username) {
        return ResponseEntity.ok(travelPackageService.getTravelPackagesByUsername(username));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TravelPackage> getTravelPackageById(@PathVariable Long id) {
        TravelPackage travelPackage = travelPackageService.getTravelPackageById(id);
        if (travelPackage == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(travelPackage);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTravelPackage(
            @PathVariable Long id,
            @RequestParam String packageName,
            @RequestParam String destination,
            @RequestParam double price,
            @RequestParam(required = false) List<String> restaurants,
            @RequestParam(required = false) List<String> hotels,
            @RequestParam(required = false) List<MultipartFile> restaurantImages,
            @RequestParam(required = false) List<MultipartFile> hotelImages,
            @RequestParam String username) {
        try {
            TravelPackage travelPackage = travelPackageService.getTravelPackageById(id);
            if (travelPackage == null) {
                return ResponseEntity.notFound().build();
            }

            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            // Verify the user owns this package
            if (!travelPackage.getUser().getId().equals(user.getId())) {
                return ResponseEntity.status(403).body("You don't have permission to update this package");
            }

            // Update basic information
            travelPackage.setName(packageName);
            travelPackage.setDescription("Package to " + destination);
            travelPackage.setPrice(price);
            
            // Save the updated package
            travelPackageService.updateTravelPackage(travelPackage);
            
            // Handle restaurant updates
            if (restaurants != null && !restaurants.isEmpty()) {
                // Clear existing restaurants
                List<Restaurant> existingRestaurants = new ArrayList<>(travelPackage.getRestaurants());
                for (Restaurant restaurant : existingRestaurants) {
                    restaurantRepository.delete(restaurant);
                }
                
                // Add new restaurants
                for (int i = 0; i < restaurants.size(); i++) {
                    if (restaurants.get(i) != null && !restaurants.get(i).isEmpty()) {
                        Restaurant restaurant = new Restaurant();
                        restaurant.setName(restaurants.get(i));
                        restaurant.setTravelPackage(travelPackage);
                        restaurantRepository.save(restaurant);
                        
                        // Handle restaurant images if provided
                        if (restaurantImages != null && i < restaurantImages.size()) {
                            MultipartFile image = restaurantImages.get(i);
                            if (!image.isEmpty()) {
                                travelPackageService.saveImage(image);
                            }
                        }
                    }
                }
            }
            
            // Handle hotel updates
            if (hotels != null && !hotels.isEmpty()) {
                // Clear existing hotels
                List<Hotel> existingHotels = new ArrayList<>(travelPackage.getHotels());
                for (Hotel hotel : existingHotels) {
                    hotelRepository.delete(hotel);
                }
                
                // Add new hotels
                for (int i = 0; i < hotels.size(); i++) {
                    if (hotels.get(i) != null && !hotels.get(i).isEmpty()) {
                        Hotel hotel = new Hotel();
                        hotel.setName(hotels.get(i));
                        hotel.setTravelPackage(travelPackage);
                        hotelRepository.save(hotel);
                        
                        // Handle hotel images if provided
                        if (hotelImages != null && i < hotelImages.size()) {
                            MultipartFile image = hotelImages.get(i);
                            if (!image.isEmpty()) {
                                travelPackageService.saveImage(image);
                            }
                        }
                    }
                }
            }
            
            return ResponseEntity.ok("Travel package updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating travel package: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTravelPackage(@PathVariable Long id) {
        TravelPackage travelPackage = travelPackageService.getTravelPackageById(id);
        if (travelPackage == null) {
            return ResponseEntity.notFound().build();
        }
        
        travelPackageService.deleteTravelPackage(id);
        return ResponseEntity.ok("Travel package deleted successfully");
    }
}