package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.TravelAgency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelAgencyRepository extends JpaRepository<TravelAgency, Long> {
    // Custom query methods can be defined here
}