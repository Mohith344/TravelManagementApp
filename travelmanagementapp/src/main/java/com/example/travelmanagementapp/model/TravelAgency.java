package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TravelAgency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String contactInfo;

    @OneToMany(mappedBy = "travelAgency")
    private List<TravelPackage> travelPackages;

    // Getters and Setters
}