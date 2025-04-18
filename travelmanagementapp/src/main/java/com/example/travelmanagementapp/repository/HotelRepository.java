package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // Custom query methods can be defined here
}