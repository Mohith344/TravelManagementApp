package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false)
    private LocalDateTime uploadDate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;
    
    @Column
    private String type; // "restaurant", "hotel", "package", etc.
    
    @Column
    private Long relatedEntityId; // ID of the related restaurant, hotel, or package

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }

    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Long getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(Long relatedEntityId) { this.relatedEntityId = relatedEntityId; }
}