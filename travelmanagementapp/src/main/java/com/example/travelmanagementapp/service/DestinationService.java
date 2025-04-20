package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Destination;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.repository.DestinationRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class DestinationService {
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private ImageService imageService;
    
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }
    
    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id).orElse(null);
    }
    
    public Destination createDestination(String name, String country, String description, MultipartFile image, String username) throws IOException {
        Destination destination = new Destination();
        destination.setName(name);
        destination.setCountry(country);
        destination.setDescription(description);
        
        // Save to get an ID
        destination = destinationRepository.save(destination);
        
        // Handle image upload if provided
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "destination", destination.getId());
        }
        
        return destination;
    }
    
    public Destination updateDestination(Long id, String name, String country, String description, MultipartFile image, String username) throws IOException {
        Destination destination = destinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        
        if (name != null) {
            destination.setName(name);
        }
        
        if (country != null) {
            destination.setCountry(country);
        }
        
        if (description != null) {
            destination.setDescription(description);
        }
        
        // Handle image upload if provided
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "destination", destination.getId());
        }
        
        return destinationRepository.save(destination);
    }
    
    public void deleteDestination(Long id, String username) {
        Destination destination = destinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Destination not found with id: " + id));
        
        // Delete associated hotels and restaurants
        List<Hotel> hotels = hotelRepository.findByDestinationId(id);
        List<Restaurant> restaurants = restaurantRepository.findByDestinationId(id);
        
        hotelRepository.deleteAll(hotels);
        restaurantRepository.deleteAll(restaurants);
        
        destinationRepository.delete(destination);
    }
    
    public List<Hotel> getHotelsByDestination(Long destinationId) {
        return hotelRepository.findByDestinationId(destinationId);
    }
    
    public List<Restaurant> getRestaurantsByDestination(Long destinationId) {
        return restaurantRepository.findByDestinationId(destinationId);
    }
}