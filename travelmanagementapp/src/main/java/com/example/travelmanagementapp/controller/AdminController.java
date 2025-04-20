package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.Destination;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.example.travelmanagementapp.model.TravelPackage;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // Destination endpoints
    @GetMapping("/destinations")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(adminService.getAllDestinations());
    }
    
    @GetMapping("/destinations/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        Destination destination = adminService.getDestinationById(id);
        if (destination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(destination);
    }
    
    @PostMapping("/destinations")
    public ResponseEntity<Destination> createDestination(
            @RequestParam("name") String name,
            @RequestParam("country") String country,
            @RequestParam("description") String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        // Use a default admin username if none provided
        String effectiveUsername = (username != null) ? username : "admin";
        
        Destination destination = adminService.createDestination(
            name, country, description, image, effectiveUsername);
            
        return ResponseEntity.ok(destination);
    }
    
    @PutMapping("/destinations/{id}")
    public ResponseEntity<Destination> updateDestination(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "country", required = false) String country,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        Destination destination = adminService.updateDestination(
            id, name, country, description, image, effectiveUsername);
            
        return ResponseEntity.ok(destination);
    }
    
    @DeleteMapping("/destinations/{id}")
    public ResponseEntity<Void> deleteDestination(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username) {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        adminService.deleteDestination(id, effectiveUsername);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/destinations/debug")
    public ResponseEntity<Map<String, Object>> debugDestinations() {
        List<Destination> destinations = adminService.getAllDestinations();
        Map<String, Object> response = new HashMap<>();
        
        response.put("count", destinations.size());
        
        // Add simplified data without circular references
        List<Map<String, Object>> simplifiedDestinations = new ArrayList<>();
        for (Destination d : destinations) {
            Map<String, Object> dest = new HashMap<>();
            dest.put("id", d.getId());
            dest.put("name", d.getName());
            dest.put("country", d.getCountry());
            simplifiedDestinations.add(dest);
        }
        response.put("destinations", simplifiedDestinations);
        
        return ResponseEntity.ok(response);
    }
    
    // Hotel endpoints
    @GetMapping("/hotels")
    public ResponseEntity<List<Hotel>> getAllHotels() {
        return ResponseEntity.ok(adminService.getAllHotels());
    }
    
    @GetMapping("/destinations/{destinationId}/hotels")
    public ResponseEntity<List<Hotel>> getHotelsByDestination(@PathVariable Long destinationId) {
        return ResponseEntity.ok(adminService.getHotelsByDestination(destinationId));
    }
    
    @PostMapping("/hotels")
    public ResponseEntity<Hotel> createHotel(
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("pricePerNight") double pricePerNight,
            @RequestParam("address") String address,
            @RequestParam(value = "destinationId", required = false) Long destinationId,
            @RequestParam(value = "packageId", required = false) Long packageId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        Hotel hotel = adminService.createHotel(
            name, location, pricePerNight, address, destinationId, packageId, image, 
            effectiveUsername);
            
        return ResponseEntity.ok(hotel);
    }
    
    @PutMapping("/hotels/{id}")
    public ResponseEntity<Hotel> updateHotel(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "pricePerNight", required = false) Double pricePerNight,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "destinationId", required = false) Long destinationId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        Hotel hotel = adminService.updateHotel(
            id, name, location, pricePerNight, address, destinationId, image, 
            effectiveUsername);
            
        return ResponseEntity.ok(hotel);
    }
    
    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username) {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        adminService.deleteHotel(id, effectiveUsername);
        return ResponseEntity.noContent().build();
    }
    
    // Restaurant endpoints
    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurants() {
        return ResponseEntity.ok(adminService.getAllRestaurants());
    }
    
    @GetMapping("/destinations/{destinationId}/restaurants")
    public ResponseEntity<List<Restaurant>> getRestaurantsByDestination(@PathVariable Long destinationId) {
        return ResponseEntity.ok(adminService.getRestaurantsByDestination(destinationId));
    }
    
    @PostMapping("/restaurants")
    public ResponseEntity<Restaurant> createRestaurant(
            @RequestParam("name") String name,
            @RequestParam("location") String location,
            @RequestParam("address") String address,
            @RequestParam("cuisine") String cuisine,
            @RequestParam("cuisineType") String cuisineType,
            @RequestParam(value = "destinationId", required = false) Long destinationId,
            @RequestParam(value = "packageId", required = false) Long packageId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        Restaurant restaurant = adminService.createRestaurant(
            name, location, address, cuisine, cuisineType, destinationId, packageId, image, 
            effectiveUsername);
            
        return ResponseEntity.ok(restaurant);
    }
    
    @PutMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "cuisine", required = false) String cuisine,
            @RequestParam(value = "cuisineType", required = false) String cuisineType,
            @RequestParam(value = "destinationId", required = false) Long destinationId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam(value = "username", required = false) String username) throws IOException {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        Restaurant restaurant = adminService.updateRestaurant(
            id, name, location, address, cuisine, cuisineType, destinationId, image, 
            effectiveUsername);
            
        return ResponseEntity.ok(restaurant);
    }
    
    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @PathVariable Long id,
            @RequestParam(value = "username", required = false) String username) {
            
        String effectiveUsername = (username != null) ? username : "admin";
        
        adminService.deleteRestaurant(id, effectiveUsername);
        return ResponseEntity.noContent().build();
    }
    
    // Legacy endpoints (keeping for backward compatibility)
    @PutMapping("/destinations/{destinationId}/hotels")
    public ResponseEntity<String> updateHotels(@PathVariable Long destinationId, @RequestBody List<Hotel> hotels) {
        adminService.updateHotels(destinationId, hotels);
        return ResponseEntity.ok("Hotels updated successfully");
    }

    @PutMapping("/destinations/{destinationId}/restaurants")
    public ResponseEntity<String> updateRestaurants(@PathVariable Long destinationId, @RequestBody List<Restaurant> restaurants) {
        adminService.updateRestaurants(destinationId, restaurants);
        return ResponseEntity.ok("Restaurants updated successfully");
    }
    
    // Search endpoints
    @GetMapping("/search/destinations")
    public ResponseEntity<List<Map<String, Object>>> searchDestinations(@RequestParam String query) {
        List<Destination> destinations = adminService.searchDestinations(query);
        
        // Create a simplified response without circular references
        List<Map<String, Object>> result = new ArrayList<>();
        for (Destination d : destinations) {
            Map<String, Object> dest = new HashMap<>();
            dest.put("id", d.getId());
            dest.put("name", d.getName());
            dest.put("country", d.getCountry());
            dest.put("description", d.getDescription());
            dest.put("type", "destination");
            
            // Get the first image for this destination if available
            String imagePath = adminService.getDestinationImagePath(d.getId());
            dest.put("imagePath", imagePath);
            
            // Get hotel and restaurant counts
            int hotelCount = d.getHotels() != null ? d.getHotels().size() : 0;
            int restaurantCount = d.getRestaurants() != null ? d.getRestaurants().size() : 0;
            dest.put("hotelCount", hotelCount);
            dest.put("restaurantCount", restaurantCount);
            
            result.add(dest);
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/search/packages")
    public ResponseEntity<List<Map<String, Object>>> searchTravelPackages(@RequestParam String query) {
        List<TravelPackage> packages = adminService.searchTravelPackages(query);
        
        // Create a simplified response without circular references
        List<Map<String, Object>> result = new ArrayList<>();
        for (TravelPackage tp : packages) {
            Map<String, Object> pack = new HashMap<>();
            pack.put("id", tp.getId());
            pack.put("name", tp.getName());
            pack.put("description", tp.getDescription());
            pack.put("price", tp.getPrice());
            pack.put("travelAgencyName", tp.getTravelAgencyName());
            pack.put("type", "package");
            
            // Get the first image for this package if available
            String imagePath = adminService.getTravelPackageImagePath(tp.getId());
            pack.put("imagePath", imagePath);
            
            // Get hotel and restaurant counts
            int hotelCount = tp.getHotels() != null ? tp.getHotels().size() : 0;
            int restaurantCount = tp.getRestaurants() != null ? tp.getRestaurants().size() : 0;
            pack.put("hotelCount", hotelCount);
            pack.put("restaurantCount", restaurantCount);
            
            result.add(pack);
        }
        
        return ResponseEntity.ok(result);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchAll(@RequestParam String query) {
        Map<String, Object> results = new HashMap<>();
        
        // Get destinations
        List<Map<String, Object>> destinations = new ArrayList<>();
        for (Destination d : adminService.searchDestinations(query)) {
            Map<String, Object> dest = new HashMap<>();
            dest.put("id", d.getId());
            dest.put("name", d.getName());
            dest.put("country", d.getCountry());
            dest.put("description", d.getDescription());
            dest.put("type", "destination");
            dest.put("imagePath", adminService.getDestinationImagePath(d.getId()));
            int hotelCount = d.getHotels() != null ? d.getHotels().size() : 0;
            int restaurantCount = d.getRestaurants() != null ? d.getRestaurants().size() : 0;
            dest.put("hotelCount", hotelCount);
            dest.put("restaurantCount", restaurantCount);
            destinations.add(dest);
        }
        
        // Get travel packages
        List<Map<String, Object>> packages = new ArrayList<>();
        for (TravelPackage tp : adminService.searchTravelPackages(query)) {
            Map<String, Object> pack = new HashMap<>();
            pack.put("id", tp.getId());
            pack.put("name", tp.getName());
            pack.put("description", tp.getDescription());
            pack.put("price", tp.getPrice());
            pack.put("travelAgencyName", tp.getTravelAgencyName());
            pack.put("type", "package");
            pack.put("imagePath", adminService.getTravelPackageImagePath(tp.getId()));
            int hotelCount = tp.getHotels() != null ? tp.getHotels().size() : 0;
            int restaurantCount = tp.getRestaurants() != null ? tp.getRestaurants().size() : 0;
            pack.put("hotelCount", hotelCount);
            pack.put("restaurantCount", restaurantCount);
            packages.add(pack);
        }
        
        results.put("destinations", destinations);
        results.put("packages", packages);
        results.put("totalResults", destinations.size() + packages.size());
        
        return ResponseEntity.ok(results);
    }
}