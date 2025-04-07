package com.example.travelmanagementapp.model;

import jakarta.persistence.*;

@Entity
public class Transportation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type; // e.g., FLIGHT, TRAIN, BUS
    private String details;
    private double price;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    private ServiceProvider serviceProvider;

    // Getters and Setters
}