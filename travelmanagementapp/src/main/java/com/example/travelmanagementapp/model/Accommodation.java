package com.example.travelmanagementapp.model;

import jakarta.persistence.*;

@Entity
public class Accommodation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; // e.g., HOTEL, HOSTEL, APARTMENT
    private String details;
    private double price;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProvider serviceProvider;

    // Getters and Setters
}