package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Complaint;
import com.example.travelmanagementapp.repository.ComplaintRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.Exception.OurException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Complaint saveComplaint(Complaint complaint) {
        if (complaint.getSubject() == null || complaint.getSubject().trim().isEmpty()) {
            throw new OurException("Complaint subject cannot be empty");
        }
        
        if (complaint.getDescription() == null || complaint.getDescription().trim().isEmpty()) {
            throw new OurException("Complaint description cannot be empty");
        }
        
        if (complaint.getUser() == null) {
            throw new OurException("Complaint must be associated with a user");
        }

        // Set defaults if not provided
        if (complaint.getStatus() == null) {
            complaint.setStatus("PENDING");
        }
        
        if (complaint.getSubmissionDate() == null) {
            complaint.setSubmissionDate(LocalDateTime.now());
        }
        
        // Only check that the entity name is provided
        if (complaint.getEntityName() == null || complaint.getEntityName().trim().isEmpty()) {
            throw new OurException("You must provide a name for the " + 
                complaint.getComplaintType().toString().toLowerCase().replace("_", " "));
        }
        
        return complaintRepository.save(complaint);
    }

    @Override
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @Override
    public List<Complaint> getComplaintsByUserId(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    @Override
    public List<Complaint> getComplaintsByUsername(String username) {
        return complaintRepository.findByUsername(username);
    }

    @Override
    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status);
    }

    @Override
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
            .orElseThrow(() -> new OurException("Complaint not found with ID: " + id));
    }

    @Override
    public Complaint updateComplaintStatus(Long id, String status, String response) {
        Complaint complaint = getComplaintById(id);
        
        if (!isValidStatus(status)) {
            throw new OurException("Invalid complaint status. Valid statuses are: PENDING, IN_PROGRESS, RESOLVED, REJECTED");
        }
        
        complaint.setStatus(status);
        
        if (response != null && !response.trim().isEmpty()) {
            complaint.setResponse(response);
        }
        
        // If the complaint is being resolved, set the resolved timestamp
        if ("RESOLVED".equals(status)) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        
        return complaintRepository.save(complaint);
    }
    
    private boolean isValidStatus(String status) {
        if (status == null) return false;
        
        // Define valid statuses
        List<String> validStatuses = List.of("PENDING", "IN_PROGRESS", "RESOLVED", "REJECTED");
        return validStatuses.contains(status);
    }
}