package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.Hotel;
import com.example.travelmanagementapp.model.Restaurant;
import com.example.travelmanagementapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PutMapping("/destinations/{destinationId}/hotels")
    public ResponseEntity<String> updateHotels(@PathVariable Long destinationId, @RequestBody List<Hotel> hotels) {
        adminService.updateHotels(destinationId, hotels);
        return ResponseEntity.ok("Hotels updated successfully");
    }

    @PutMapping("/destinations/{destinationId}/restaurants")
    public ResponseEntity<String> updateRestaurants(@PathVariable Long destinationId, @RequestBody List<Restaurant> restaurants) {
        adminService.updateRestaurants(destinationId, restaurants);
        return ResponseEntity.ok("Restaurants updated successfully");
    }
}