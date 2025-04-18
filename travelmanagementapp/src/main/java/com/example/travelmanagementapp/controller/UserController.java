package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.Exception.OurException;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        System.out.println("Received user: " + user);
        userService.registerUser(user);
        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestParam String username, @RequestParam String password, @RequestParam(required = false) String travelAgencyName) {
        User user = userService.authenticateUser(username, password);
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        if ("TRAVEL_AGENCY".equals(user.getRole()) && !user.getTravelAgencyName().equals(travelAgencyName)) {
            return ResponseEntity.status(401).body("Invalid travel agency name");
        }

        return ResponseEntity.ok("Login successful");
    }

    @ExceptionHandler(OurException.class)
    public ResponseEntity<String> handleOurException(OurException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}