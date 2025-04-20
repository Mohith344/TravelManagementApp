package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Complaint;

import java.util.List;

public interface ComplaintService {
    Complaint saveComplaint(Complaint complaint);
    
    List<Complaint> getAllComplaints();
    
    List<Complaint> getComplaintsByUserId(Long userId);
    
    List<Complaint> getComplaintsByUsername(String username);
    
    List<Complaint> getComplaintsByStatus(String status);
    
    Complaint getComplaintById(Long id);
    
    Complaint updateComplaintStatus(Long id, String status, String response);
}