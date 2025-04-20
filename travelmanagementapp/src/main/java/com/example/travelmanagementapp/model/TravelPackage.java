package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
public class TravelPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private double price;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String travelAgencyName; // Use this field instead of a TravelAgency entity

    // Flag to identify packages that are created for personal destination bookings
    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean isPersonalBooking = false;

    @JsonManagedReference
    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hotel> hotels;

    @JsonManagedReference
    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Restaurant> restaurants;

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getTravelAgencyName() {
        return travelAgencyName;
    }

    public void setTravelAgencyName(String travelAgencyName) {
        this.travelAgencyName = travelAgencyName;
    }

    public Boolean getIsPersonalBooking() {
        return isPersonalBooking;
    }

    public void setIsPersonalBooking(Boolean isPersonalBooking) {
        this.isPersonalBooking = isPersonalBooking;
    }

    public List<Hotel> getHotels() {
        return hotels;
    }

    public void setHotels(List<Hotel> hotels) {
        this.hotels = hotels;
    }

    public List<Restaurant> getRestaurants() {
        return restaurants;
    }

    public void setRestaurants(List<Restaurant> restaurants) {
        this.restaurants = restaurants;
    }
}