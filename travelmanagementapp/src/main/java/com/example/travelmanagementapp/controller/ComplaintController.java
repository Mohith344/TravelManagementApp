package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.DTO.ComplaintDTO;
import com.example.travelmanagementapp.model.*;
import com.example.travelmanagementapp.service.ComplaintService;
import com.example.travelmanagementapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> submitComplaint(@RequestBody ComplaintDTO complaintDTO, 
                                           @RequestParam(value = "username", required = false) String username) {
        try {
            // If username is not provided, check if it's in the DTO
            if (username == null && complaintDTO.getUsername() != null) {
                username = complaintDTO.getUsername();
            }
            
            // If we still don't have a username, return a more helpful error
            if (username == null) {
                return ResponseEntity.badRequest().body("Username is required. Please provide it as a query parameter or in the request body.");
            }
            
            User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            Complaint complaint = new Complaint();
            complaint.setSubject(complaintDTO.getSubject());
            complaint.setDescription(complaintDTO.getDescription());
            complaint.setUser(user);
            complaint.setUsername(username); // Setting the username field
            
            // Explicitly set timestamps
            LocalDateTime now = LocalDateTime.now();
            complaint.setCreatedAt(now);
            complaint.setSubmissionDate(now);
            
            // Set the complaint type based on what was selected
            switch(complaintDTO.getComplaintType()) {
                case "TRAVEL_PACKAGE":
                    complaint.setComplaintType(Complaint.ComplaintType.TRAVEL_PACKAGE);
                    complaint.setEntityName(complaintDTO.getEntityName());
                    complaint.setEntityId(0L); // Set default value
                    break;
                    
                case "RESTAURANT":
                    complaint.setComplaintType(Complaint.ComplaintType.RESTAURANT);
                    complaint.setEntityName(complaintDTO.getEntityName());
                    complaint.setEntityId(0L); // Set default value
                    break;
                    
                case "TRAVEL_AGENCY":
                    complaint.setComplaintType(Complaint.ComplaintType.TRAVEL_AGENCY);
                    complaint.setEntityName(complaintDTO.getEntityName());
                    complaint.setEntityId(0L); // Set default value
                    break;
                    
                default:
                    return ResponseEntity.badRequest().body("Invalid complaint type");
            }
            
            Complaint savedComplaint = complaintService.saveComplaint(complaint);
            return ResponseEntity.ok(savedComplaint);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error submitting complaint: " + e.getMessage());
        }
    }
    
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserComplaints(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            List<Complaint> complaints = complaintService.getComplaintsByUserId(user.getId());
            
            // Convert to DTOs to avoid circular references
            List<ComplaintDTO> complaintsDTO = complaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(complaintsDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving complaints: " + e.getMessage());
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<Complaint> complaints = complaintService.getAllComplaints();
            
            // Convert to DTOs to avoid circular references
            List<ComplaintDTO> complaintsDTO = complaints.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(complaintsDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error retrieving complaints: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String response) {
        try {
            Complaint complaint = complaintService.updateComplaintStatus(id, status, response);
            return ResponseEntity.ok(convertToDTO(complaint));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error updating complaint status: " + e.getMessage());
        }
    }
    
    // Helper method to convert Complaint to ComplaintDTO
    private ComplaintDTO convertToDTO(Complaint complaint) {
        ComplaintDTO dto = new ComplaintDTO();
        dto.setId(complaint.getId());
        dto.setSubject(complaint.getSubject());
        dto.setDescription(complaint.getDescription());
        dto.setStatus(complaint.getStatus());
        dto.setResponse(complaint.getResponse());
        dto.setCreatedAt(complaint.getSubmissionDate());
        dto.setResolvedAt(complaint.getResolvedAt());
        dto.setUserId(complaint.getUser().getId());
        dto.setUsername(complaint.getUser().getUsername());
        
        dto.setComplaintType(complaint.getComplaintType().toString());
        dto.setEntityName(complaint.getEntityName());
        
        return dto;
    }
}