package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query methods can be defined here

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameAndPassword(String username, String password);
    
    // Add the missing findByRole method
    List<User> findByRole(String role);
}