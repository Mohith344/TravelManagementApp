package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    // Custom query methods can be defined here
}