package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    @Query("SELECT c FROM Complaint c WHERE c.user.username = ?1")
    List<Complaint> findByUsername(String username);
    
    List<Complaint> findByStatus(String status);
    List<Complaint> findByUserId(Long userId);
}