package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.TravelAgency;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.service.TravelAgencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/travel-agencies")
public class TravelAgencyController {

    @Autowired
    private TravelAgencyService travelAgencyService;

    @PostMapping
    public ResponseEntity<String> createTravelAgency(@RequestBody TravelAgency travelAgency) {
        travelAgencyService.createTravelAgency(travelAgency);
        return ResponseEntity.ok("Travel agency created successfully");
    }

    @GetMapping
    public ResponseEntity<List<TravelAgency>> getAllTravelAgencies() {
        return ResponseEntity.ok(travelAgencyService.getAllTravelAgencies());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateTravelAgency(@PathVariable Long id, @RequestBody TravelAgency updatedAgency) {
        TravelAgency travelAgency = travelAgencyService.getTravelAgencyById(id);
        if (travelAgency == null) {
            return ResponseEntity.notFound().build();
        }
        travelAgency.setName(updatedAgency.getName());
        travelAgency.setContactInfo(updatedAgency.getContactInfo());
        travelAgencyService.updateTravelAgency(travelAgency);
        return ResponseEntity.ok("Travel agency updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTravelAgency(@PathVariable Long id) {
        travelAgencyService.deleteTravelAgency(id);
        return ResponseEntity.ok("Travel agency deleted successfully");
    }

    @PostMapping("/packages")
    public ResponseEntity<String> createTravelPackage(@RequestBody TravelPackage travelPackage) {
        travelAgencyService.createTravelPackage(travelPackage);
        return ResponseEntity.ok("Travel package created successfully");
    }
}