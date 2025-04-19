package com.example.travelmanagementapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.model.User;
//import com.example.travelmanagementapp.model.TravelAgency;
import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import com.example.travelmanagementapp.repository.UserRepository;
//import com.example.travelmanagementapp.repository.TravelAgencyRepository;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;

@SpringBootApplication
public class TravelManagementAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravelManagementAppApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadData(UserRepository userRepository, TravelPackageRepository travelPackageRepository, HotelRepository hotelRepository, RestaurantRepository restaurantRepository) {
        return args -> {
            // Add default admin user
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword("admin123");
                admin.setEmail("admin@example.com");
                admin.setRole("ROLE_ADMIN");
                userRepository.save(admin);

                User traveller = new User();
                traveller.setUsername("traveller");
                traveller.setPassword("traveller123");
                traveller.setEmail("traveller@example.com");
                traveller.setRole("ROLE_TRAVELLER");
                userRepository.save(traveller);

                User travelAgencyUser = new User();
                travelAgencyUser.setUsername("agencyuser");
                travelAgencyUser.setPassword("agency123");
                travelAgencyUser.setEmail("agency@example.com");
                travelAgencyUser.setRole("ROLE_TRAVEL_AGENCY");
                travelAgencyUser.setTravelAgencyName("Default Agency");
                userRepository.save(travelAgencyUser);
            }

            // Add default travel package
            if (travelPackageRepository.count() == 0) {
                TravelPackage travelPackage = new TravelPackage();
                travelPackage.setName("Default Package");
                travelPackage.setDescription("A default travel package");
                travelPackage.setPrice(1000.0);
                travelPackage.setUser(userRepository.findByUsername("agencyuser").orElse(null));
                travelPackage.setTravelAgencyName("Default Agency");
                travelPackageRepository.save(travelPackage);
            }

            // Add default hotels
            if (hotelRepository.count() == 0) {
                Hotel hotel = new Hotel();
                hotel.setName("Default Hotel");
                hotel.setLocation("Default Location");
                hotel.setPricePerNight(200.0);
                hotel.setAddress("Default Address");
                hotel.setTravelPackage(travelPackageRepository.findAll().get(0));
                hotelRepository.save(hotel);
            }

            // Add default restaurants
            if (restaurantRepository.count() == 0) {
                Restaurant restaurant = new Restaurant();
                restaurant.setName("Default Restaurant");
                restaurant.setLocation("Default Location");
                restaurant.setAddress("Default Address");
                restaurant.setCuisine("Default Cuisine");
                restaurant.setCuisineType("Default Cuisine");
                restaurant.setTravelPackage(travelPackageRepository.findAll().get(0));
                restaurantRepository.save(restaurant);
            }
        };
    }
}