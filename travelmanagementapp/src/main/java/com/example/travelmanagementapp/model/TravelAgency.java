package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class TravelAgency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String contactInfo;

    @OneToMany(mappedBy = "travelAgency", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TravelPackage> travelPackages;

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

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public List<TravelPackage> getTravelPackages() {
        return travelPackages;
    }

    public void setTravelPackages(List<TravelPackage> travelPackages) {
        this.travelPackages = travelPackages;
    }
}