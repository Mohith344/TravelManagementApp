package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    // Custom query methods can be defined here
}