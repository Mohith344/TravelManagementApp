package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Custom query methods can be defined here
}