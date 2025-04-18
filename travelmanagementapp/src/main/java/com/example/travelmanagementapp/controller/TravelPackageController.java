package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.service.TravelPackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel-packages")
public class TravelPackageController {

    @Autowired
    private TravelPackageService travelPackageService;

    @PostMapping
    public ResponseEntity<String> createTravelPackage(@RequestBody TravelPackage travelPackage) {
        travelPackageService.createTravelPackage(travelPackage);
        return ResponseEntity.ok("Travel package created successfully");
    }

    @GetMapping
    public ResponseEntity<List<TravelPackage>> getAllTravelPackages() {
        return ResponseEntity.ok(travelPackageService.getAllTravelPackages());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTravelPackage(@PathVariable Long id, @RequestBody TravelPackage updatedPackage) {
        TravelPackage travelPackage = travelPackageService.getTravelPackageById(id);
        if (travelPackage == null) {
            return ResponseEntity.notFound().build();
        }
        travelPackage.setName(updatedPackage.getName());
        travelPackage.setDescription(updatedPackage.getDescription());
        travelPackage.setPrice(updatedPackage.getPrice());
        travelPackageService.updateTravelPackage(travelPackage);
        return ResponseEntity.ok("Travel package updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTravelPackage(@PathVariable Long id) {
        travelPackageService.deleteTravelPackage(id);
        return ResponseEntity.ok("Travel package deleted successfully");
    }
}