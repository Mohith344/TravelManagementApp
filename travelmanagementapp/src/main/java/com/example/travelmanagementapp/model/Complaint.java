package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String subject;

    @Column(nullable = false, length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintType complaintType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    // Add username field
    @Column(nullable = false)
    private String username;
    
    // Store the name as a string
    @Column
    private String entityName;
    
    // Add entity_id field with a default value of 0
    @Column(name = "entity_id", nullable = false, columnDefinition = "bigint default 0")
    private Long entityId = 0L;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate = LocalDateTime.now();
    
    @Column
    private LocalDateTime resolvedAt;
    
    @Column
    private String status = "PENDING";
    
    @Column(length = 1000)
    private String response;

    public enum ComplaintType {
        RESTAURANT,
        TRAVEL_PACKAGE,
        TRAVEL_AGENCY
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public ComplaintType getComplaintType() { return complaintType; }
    public void setComplaintType(ComplaintType complaintType) { this.complaintType = complaintType; }
    
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getEntityName() { return entityName; }
    public void setEntityName(String entityName) { this.entityName = entityName; }
    
    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId != null ? entityId : 0L; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }
    
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}