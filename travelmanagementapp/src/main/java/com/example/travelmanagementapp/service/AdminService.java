package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Destination;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.DestinationRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.ImageRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.repository.TravelPackageRepository;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ImageService imageService;
    
    @Autowired
    private TravelPackageRepository travelPackageRepository;
    
    @Autowired
    private ImageRepository imageRepository;

    // Destination Management
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }
    
    public Destination getDestinationById(Long id) {
        return destinationRepository.findById(id).orElse(null);
    }
    
    public Destination createDestination(String name, String country, String description, 
                                         MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage destinations");
        }
        
        Destination destination = new Destination();
        destination.setName(name);
        destination.setCountry(country);
        destination.setDescription(description);
        
        // Save the destination first to get an ID
        destination = destinationRepository.save(destination);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "destination", destination.getId(), username);
        }
        
        return destination;
    }
    
    public Destination updateDestination(Long id, String name, String country, String description, 
                                         MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage destinations");
        }
        
        Destination destination = destinationRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
        
        destination.setName(name != null ? name : destination.getName());
        destination.setCountry(country != null ? country : destination.getCountry());
        destination.setDescription(description != null ? description : destination.getDescription());
        
        destination = destinationRepository.save(destination);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "destination", destination.getId(), username);
        }
        
        return destination;
    }
    
    public void deleteDestination(Long id, String username) {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage destinations");
        }
        
        destinationRepository.deleteById(id);
    }
    
    // Hotel Management
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
    
    public List<Hotel> getHotelsByDestination(Long destinationId) {
        Optional<Destination> destination = destinationRepository.findById(destinationId);
        if (destination.isPresent()) {
            return destination.get().getHotels();
        }
        return List.of();
    }
    
    public Hotel createHotel(String name, String location, double pricePerNight, String address, 
                            Long destinationId, Long packageId, MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage hotels");
        }
        
        Hotel hotel = new Hotel();
        hotel.setName(name);
        hotel.setLocation(location);
        hotel.setPricePerNight(pricePerNight);
        hotel.setAddress(address);
        
        // Set destination if provided
        if (destinationId != null) {
            Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
            hotel.setDestination(destination);
        }
        
        // Set travel package if provided
        if (packageId != null) {
            TravelPackage travelPackage = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new IllegalArgumentException("Travel package not found"));
            hotel.setTravelPackage(travelPackage);
        } else {
            // If no package ID was provided, we need a default package
            // Option 1: Use the first available travel package
            TravelPackage defaultPackage = travelPackageRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No travel packages available. Please create a travel package first."));
            hotel.setTravelPackage(defaultPackage);
            
            // Option 2 (alternative): Create a default package if none exists
            // This would be more complex and require additional logic
        }
        
        // Save the hotel to get an ID
        hotel = hotelRepository.save(hotel);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            try {
                imageService.saveImage(image, "hotel", hotel.getId(), username);
            } catch (Exception e) {
                // Log the error but don't fail the hotel creation
                System.err.println("Error saving hotel image: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        return hotel;
    }
    
    public Hotel updateHotel(Long id, String name, String location, Double pricePerNight, 
                           String address, Long destinationId, MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage hotels");
        }
        
        Hotel hotel = hotelRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Hotel not found"));
        
        hotel.setName(name != null ? name : hotel.getName());
        hotel.setLocation(location != null ? location : hotel.getLocation());
        if (pricePerNight != null) hotel.setPricePerNight(pricePerNight);
        hotel.setAddress(address != null ? address : hotel.getAddress());
        
        if (destinationId != null) {
            Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
            hotel.setDestination(destination);
        }
        
        // No need to update travel package - it should already have one
        // Only update it if the previous one was null for some reason
        if (hotel.getTravelPackage() == null) {
            TravelPackage defaultPackage = travelPackageRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No travel packages available"));
            hotel.setTravelPackage(defaultPackage);
        }
        
        hotel = hotelRepository.save(hotel);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "hotel", hotel.getId(), username);
        }
        
        return hotel;
    }
    
    public void deleteHotel(Long id, String username) {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage hotels");
        }
        
        hotelRepository.deleteById(id);
    }
    
    // Restaurant Management
    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }
    
    public List<Restaurant> getRestaurantsByDestination(Long destinationId) {
        Optional<Destination> destination = destinationRepository.findById(destinationId);
        if (destination.isPresent()) {
            return destination.get().getRestaurants();
        }
        return List.of();
    }
    
    public Restaurant createRestaurant(String name, String location, String address, String cuisine, 
                                     String cuisineType, Long destinationId, Long packageId, 
                                     MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage restaurants");
        }
        
        Restaurant restaurant = new Restaurant();
        restaurant.setName(name);
        restaurant.setLocation(location);
        restaurant.setAddress(address);
        restaurant.setCuisine(cuisine);
        restaurant.setCuisineType(cuisineType);
        
        // Set destination if provided
        if (destinationId != null) {
            Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
            restaurant.setDestination(destination);
        }
        
        // Set travel package if provided
        if (packageId != null) {
            TravelPackage travelPackage = travelPackageRepository.findById(packageId)
                .orElseThrow(() -> new IllegalArgumentException("Travel package not found"));
            restaurant.setTravelPackage(travelPackage);
        } else {
            // If no package ID was provided, we need a default package
            TravelPackage defaultPackage = travelPackageRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No travel packages available. Please create a travel package first."));
            restaurant.setTravelPackage(defaultPackage);
        }
        
        // Save the restaurant to get an ID
        restaurant = restaurantRepository.save(restaurant);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "restaurant", restaurant.getId(), username);
        }
        
        return restaurant;
    }
    
    public Restaurant updateRestaurant(Long id, String name, String location, String address, 
                                     String cuisine, String cuisineType, Long destinationId, 
                                     MultipartFile image, String username) throws IOException {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage restaurants");
        }
        
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Restaurant not found"));
        
        restaurant.setName(name != null ? name : restaurant.getName());
        restaurant.setLocation(location != null ? location : restaurant.getLocation());
        restaurant.setAddress(address != null ? address : restaurant.getAddress());
        restaurant.setCuisine(cuisine != null ? cuisine : restaurant.getCuisine());
        restaurant.setCuisineType(cuisineType != null ? cuisineType : restaurant.getCuisineType());
        
        if (destinationId != null) {
            Destination destination = destinationRepository.findById(destinationId)
                .orElseThrow(() -> new IllegalArgumentException("Destination not found"));
            restaurant.setDestination(destination);
        }
        
        restaurant = restaurantRepository.save(restaurant);
        
        // If an image was provided, save it
        if (image != null && !image.isEmpty()) {
            imageService.saveImage(image, "restaurant", restaurant.getId(), username);
        }
        
        return restaurant;
    }
    
    public void deleteRestaurant(Long id, String username) {
        // Validate that the user is an admin
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        if (!"ADMIN".equals(user.getRole())) {
            throw new IllegalStateException("Only admin users can manage restaurants");
        }
        
        restaurantRepository.deleteById(id);
    }
    
    // Existing methods
    public void updateHotels(Long destinationId, List<Hotel> hotels) {
        // Logic to update hotels for a destination
        hotelRepository.saveAll(hotels);
    }

    public void updateRestaurants(Long destinationId, List<Restaurant> restaurants) {
        // Logic to update restaurants for a destination
        restaurantRepository.saveAll(restaurants);
    }
    
    // Search functionality
    public List<Destination> searchDestinations(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllDestinations();
        }
        
        String lowercaseQuery = query.toLowerCase();
        return destinationRepository.findAll().stream()
            .filter(d -> 
                (d.getName() != null && d.getName().toLowerCase().contains(lowercaseQuery)) ||
                (d.getCountry() != null && d.getCountry().toLowerCase().contains(lowercaseQuery)) ||
                (d.getDescription() != null && d.getDescription().toLowerCase().contains(lowercaseQuery))
            )
            .collect(Collectors.toList());
    }
    
    // New search method for travel packages
    public List<TravelPackage> searchTravelPackages(String query) {
        if (query == null || query.trim().isEmpty()) {
            return travelPackageRepository.findAll();
        }
        
        String lowercaseQuery = query.toLowerCase();
        return travelPackageRepository.findAll().stream()
            .filter(tp -> 
                (tp.getName() != null && tp.getName().toLowerCase().contains(lowercaseQuery)) ||
                (tp.getDescription() != null && tp.getDescription().toLowerCase().contains(lowercaseQuery))
            )
            .collect(Collectors.toList());
    }
    
    // Search all (combined results)
    public Map<String, Object> searchAll(String query) {
        Map<String, Object> results = new HashMap<>();
        results.put("destinations", searchDestinations(query));
        results.put("travelPackages", searchTravelPackages(query));
        return results;
    }
    
    public String getDestinationImagePath(Long destinationId) {
        // Find all images for this destination
        List<Image> images = imageRepository.findByEntityTypeAndEntityId("destination", destinationId);
        if (images != null && !images.isEmpty()) {
            // Return the first image path
            return images.get(0).getFilePath();
        }
        
        // Return a default image path if no image is found
        return "uploads/destination/default.jpg";
    }
    
    public String getTravelPackageImagePath(Long packageId) {
        // Find all images for this package
        List<Image> images = imageRepository.findByEntityTypeAndEntityId("package_restaurant", packageId);
        if (images != null && !images.isEmpty()) {
            // Return the first image path
            return images.get(0).getFilePath();
        }
        
        // If no restaurant image, try hotel images
        images = imageRepository.findByEntityTypeAndEntityId("package_hotel", packageId);
        if (images != null && !images.isEmpty()) {
            // Return the first image path
            return images.get(0).getFilePath();
        }
        
        // Return a default image path if no image is found
        return "uploads/packages/default.jpg";
    }
}