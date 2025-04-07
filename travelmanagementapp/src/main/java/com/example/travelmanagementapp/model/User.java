package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String email;
    private String role; // e.g., TRAVELLER, ADMIN

    @OneToMany(mappedBy = "user")
    private List<Booking> bookings;

    // Getters and Setters
}