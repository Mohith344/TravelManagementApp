package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String address;
    
    @Column(name = "cuisine", nullable = false)
    private String cuisine;

    @Column(name = "cuisine_type", nullable = false)
    private String cuisineType;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "travel_package_id")
    private TravelPackage travelPackage;
    
    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "destination_id")
    private Destination destination;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }

    public String getCuisineType() {
        return cuisineType;
    }
    
    public void setCuisineType(String cuisineType) {
        this.cuisineType = cuisineType;
    }

    public TravelPackage getTravelPackage() {
        return travelPackage;
    }

    public void setTravelPackage(TravelPackage travelPackage) {
        this.travelPackage = travelPackage;
    }
    
    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }
}