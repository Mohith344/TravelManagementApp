package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.repository.HotelRepository;
import com.example.travelmanagementapp.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    public void updateHotels(Long destinationId, List<Hotel> hotels) {
        // Logic to update hotels for a destination
        hotelRepository.saveAll(hotels);
    }

    public void updateRestaurants(Long destinationId, List<Restaurant> restaurants) {
        // Logic to update restaurants for a destination
        restaurantRepository.saveAll(restaurants);
    }
}