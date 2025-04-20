package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.Destination;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.service.DestinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/destinations")
@CrossOrigin(origins = {"http://localhost:3000"})
public class DestinationController {

    @Autowired
    private DestinationService destinationService;

    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        return ResponseEntity.ok(destinationService.getAllDestinations());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable Long id) {
        Destination destination = destinationService.getDestinationById(id);
        if (destination == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(destination);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Destination> createDestination(
            @RequestParam String name,
            @RequestParam String country,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image,
            Principal principal) throws IOException {
        
        Destination destination = destinationService.createDestination(
                name, country, description, image, principal.getName());
        
        return ResponseEntity.ok(destination);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Destination> updateDestination(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) MultipartFile image,
            Principal principal) throws IOException {
        
        Destination destination = destinationService.updateDestination(
                id, name, country, description, image, principal.getName());
        
        return ResponseEntity.ok(destination);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDestination(@PathVariable Long id, Principal principal) {
        destinationService.deleteDestination(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/hotels")
    public ResponseEntity<List<Hotel>> getHotelsByDestination(@PathVariable Long id) {
        List<Hotel> hotels = destinationService.getHotelsByDestination(id);
        return ResponseEntity.ok(hotels);
    }

    @GetMapping("/{id}/restaurants")
    public ResponseEntity<List<Restaurant>> getRestaurantsByDestination(@PathVariable Long id) {
        List<Restaurant> restaurants = destinationService.getRestaurantsByDestination(id);
        return ResponseEntity.ok(restaurants);
    }
}