package com.example.travelmanagementapp.service;
import com.example.travelmanagementapp.Exception.OurException;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

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

    public User authenticateUser(String username, String password) {
        return userRepository.findByUsernameAndPassword(username, password).orElse(null);
    }
}