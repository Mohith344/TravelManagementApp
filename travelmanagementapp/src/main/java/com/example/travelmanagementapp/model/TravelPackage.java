package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TravelPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private double price;

    @ManyToOne
    @JoinColumn(name = "travel_agency_id")
    private TravelAgency travelAgency;

    @OneToMany(mappedBy = "travelPackage")
    private List<Booking> bookings;

    // Getters and Setters
}