package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.TravelPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    // Custom query methods can be defined here
    List<TravelPackage> findByUserUsername(String username);
}