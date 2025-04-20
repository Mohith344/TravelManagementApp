package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByDestinationId(Long destinationId);
}