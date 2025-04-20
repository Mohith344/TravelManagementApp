package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.Exception.OurException;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    public void registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new OurException("A user with this username already exists.");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new OurException("A user with this email already exists.");
        }
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getUsername())
            .password(user.getPassword())
            .roles(user.getRole())
            .build();
    }

    public User authenticateUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password).orElse(null);
    }
    
    // Method needed by the complaint functionality
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}