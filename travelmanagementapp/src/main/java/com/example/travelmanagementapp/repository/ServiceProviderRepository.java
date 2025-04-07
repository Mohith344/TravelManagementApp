package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    // Custom query methods can be defined here
}