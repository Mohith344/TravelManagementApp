package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    // Custom query methods can be defined here
}