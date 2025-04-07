package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Accommodation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    // Custom query methods can be defined here


}