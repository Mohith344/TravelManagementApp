package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.Exception.OurException;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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
    public ResponseEntity<Map<String, Object>> loginUser(@RequestParam String username, @RequestParam String password) {
        User user = userService.authenticateUser(username, password);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("isLoggedIn", true);

        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(OurException.class)
    public ResponseEntity<String> handleOurException(OurException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}