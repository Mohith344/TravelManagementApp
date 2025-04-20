package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HotelRepository extends JpaRepository<Hotel, Long> {
    List<Hotel> findByDestinationId(Long destinationId);
}