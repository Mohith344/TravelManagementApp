package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Transportation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransportationRepository extends JpaRepository<Transportation, Long> {
    // Custom query methods can be defined here
}