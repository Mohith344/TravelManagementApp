package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
public class TravelPackageService {

    @Autowired
    private TravelPackageRepository travelPackageRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private HotelRepository hotelRepository;
    
    @Autowired
    private ImageService imageService;

    public void createTravelPackage(TravelPackage travelPackage) {
        travelPackageRepository.save(travelPackage);
    }

    public List<TravelPackage> getAllTravelPackages() {
        return travelPackageRepository.findAll();
    }
    
    public List<TravelPackage> getTravelPackagesByUsername(String username) {
        return travelPackageRepository.findByUserUsername(username);
    }

    public TravelPackage getTravelPackageById(Long id) {
        return travelPackageRepository.findById(id).orElse(null);
    }

    public void updateTravelPackage(TravelPackage travelPackage) {
        travelPackageRepository.save(travelPackage);
    }

    public void deleteTravelPackage(Long id) {
        travelPackageRepository.deleteById(id);
    }

    @Transactional
    public void createTravelPackageWithDetails(String packageName, String destination, List<String> restaurants, List<String> hotels, List<MultipartFile> restaurantImages, List<MultipartFile> hotelImages, User user) throws IOException {
        TravelPackage travelPackage = new TravelPackage();
        travelPackage.setName(packageName);
        travelPackage.setDescription("Package to " + destination);
        travelPackage.setPrice(0.0);
        travelPackage.setUser(user);

        // Save travel package
        travelPackageRepository.save(travelPackage);

        // Save restaurants and their images
        for (int i = 0; i < restaurants.size(); i++) {
            if (restaurants.get(i) != null && !restaurants.get(i).isEmpty()) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName(restaurants.get(i));
                restaurant.setTravelPackage(travelPackage);
                restaurantRepository.save(restaurant);

                // Process and save restaurant images
                if (restaurantImages != null && i < restaurantImages.size()) {
                    List<String> fileNames = imageService.savePackageImages(
                            List.of(restaurantImages.get(i)), 
                            user, 
                            "restaurant");
                    // You can store these filenames in your restaurant entity if needed
                }
            }
        }

        // Save hotels and their images
        for (int i = 0; i < hotels.size(); i++) {
            if (hotels.get(i) != null && !hotels.get(i).isEmpty()) {
                Hotel hotel = new Hotel();
                hotel.setName(hotels.get(i));
                hotel.setTravelPackage(travelPackage);
                hotelRepository.save(hotel);

                // Process and save hotel images
                if (hotelImages != null && i < hotelImages.size()) {
                    List<String> fileNames = imageService.savePackageImages(
                            List.of(hotelImages.get(i)), 
                            user, 
                            "hotel");
                    // You can store these filenames in your hotel entity if needed
                }
            }
        }
    }

    @Transactional
    public void createTravelPackageWithDetails(String packageName, String destination, double price,
                                               List<String> restaurants, List<String> hotels,
                                               List<MultipartFile> restaurantImages, List<MultipartFile> hotelImages,
                                               User user) throws IOException {
        TravelPackage travelPackage = new TravelPackage();
        travelPackage.setName(packageName);
        travelPackage.setDescription("Package to " + destination);
        travelPackage.setPrice(price);
        travelPackage.setUser(user);

        // Save travel package first to get the ID
        travelPackageRepository.save(travelPackage);

        // Process package-level images if any
        if (restaurantImages != null && !restaurantImages.isEmpty()) {
            List<String> restaurantFileNames = imageService.savePackageImages(
                    restaurantImages,
                    user,
                    "restaurant");
            
            // Store association between images and package
            for (String fileName : restaurantFileNames) {
                // You might want to store these in a separate table or list
            }
        }
        
        if (hotelImages != null && !hotelImages.isEmpty()) {
            List<String> hotelFileNames = imageService.savePackageImages(
                    hotelImages,
                    user,
                    "hotel");
            
            // Store association between images and package
            for (String fileName : hotelFileNames) {
                // You might want to store these in a separate table or list
            }
        }

        // Save restaurants
        for (int i = 0; i < restaurants.size(); i++) {
            if (restaurants.get(i) != null && !restaurants.get(i).isEmpty()) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName(restaurants.get(i));
                restaurant.setTravelPackage(travelPackage);
                restaurantRepository.save(restaurant);
            }
        }

        // Save hotels
        for (int i = 0; i < hotels.size(); i++) {
            if (hotels.get(i) != null && !hotels.get(i).isEmpty()) {
                Hotel hotel = new Hotel();
                hotel.setName(hotels.get(i));
                hotel.setTravelPackage(travelPackage);
                hotelRepository.save(hotel);
            }
        }
    }

    @Transactional
    public void createTravelPackageWithDetails(String packageName, String destination, double price,
                                               List<String> restaurants, List<String> hotels,
                                               List<MultipartFile> restaurantImages, List<MultipartFile> hotelImages,
                                               User user, String travelAgencyName) throws IOException {
        TravelPackage travelPackage = new TravelPackage();
        travelPackage.setName(packageName);
        travelPackage.setDescription("Package to " + destination);
        travelPackage.setPrice(price);
        travelPackage.setUser(user);
        travelPackage.setTravelAgencyName(travelAgencyName);

        // Save travel package first to get its ID
        travelPackageRepository.save(travelPackage);
        
        // Process restaurant images with package ID
        if (restaurantImages != null && !restaurantImages.isEmpty()) {
            List<String> fileNames = imageService.savePackageImages(restaurantImages, user, "restaurant", travelPackage.getId());
            // Association is now handled in the savePackageImages method
        }
        
        // Process hotel images with package ID
        if (hotelImages != null && !hotelImages.isEmpty()) {
            List<String> fileNames = imageService.savePackageImages(hotelImages, user, "hotel", travelPackage.getId());
            // Association is now handled in the savePackageImages method
        }

        // Save restaurants
        for (int i = 0; i < restaurants.size(); i++) {
            if (restaurants.get(i) != null && !restaurants.get(i).isEmpty()) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName(restaurants.get(i));
                restaurant.setTravelPackage(travelPackage);
                restaurantRepository.save(restaurant);
            }
        }

        // Save hotels
        for (int i = 0; i < hotels.size(); i++) {
            if (hotels.get(i) != null && !hotels.get(i).isEmpty()) {
                Hotel hotel = new Hotel();
                hotel.setName(hotels.get(i));
                hotel.setTravelPackage(travelPackage);
                hotelRepository.save(hotel);
            }
        }
    }

    /**
     * Saves an image file to the uploads directory
     * @param image The MultipartFile image to save
     * @return The filename of the saved image
     * @throws IOException If there is an error saving the file
     */
    public String saveImage(MultipartFile image) throws IOException {
        String uploadDir = "uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        File dest = new File(dir, filename);
        image.transferTo(dest);
        return filename;
    }
}