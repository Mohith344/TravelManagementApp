package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<Image, Long> {
    // Custom query methods can be defined here
}