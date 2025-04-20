package com.example.travelmanagementapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String filePath;
    
    // Required by database (NOT NULL)
    private String filename;
    
    // Required by database (NOT NULL)
    private LocalDateTime uploadDate;
    
    // New fields
    private String entityType;
    private Long entityId;
    
    // Legacy fields still in database
    private String type;
    
    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploader_id", nullable = false)
    private User uploader;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    
    public String getFilename() { return filename; }
    public void setFilename(String filename) { this.filename = filename; }
    
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public Long getEntityId() { return entityId; }
    public void setEntityId(Long entityId) { this.entityId = entityId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public Long getRelatedEntityId() { return relatedEntityId; }
    public void setRelatedEntityId(Long relatedEntityId) { this.relatedEntityId = relatedEntityId; }

    public User getUploader() { return uploader; }
    public void setUploader(User uploader) { this.uploader = uploader; }
}