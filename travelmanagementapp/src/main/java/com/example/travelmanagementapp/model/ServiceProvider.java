package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class ServiceProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String serviceType; // e.g., TRANSPORTATION, ACCOMMODATION

    @OneToMany(mappedBy = "serviceProvider")
    private List<Transportation> transportations;

    @OneToMany(mappedBy = "serviceProvider")
    private List<Accommodation> accommodations;

    // Getters and Setters
}