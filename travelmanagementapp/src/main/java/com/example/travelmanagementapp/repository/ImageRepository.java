package com.example.travelmanagementapp.repository;

import com.example.travelmanagementapp.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {
    // Legacy methods
    List<Image> findByTypeAndRelatedEntityId(String type, Long relatedEntityId);
    
    // New methods with updated fields
    List<Image> findByEntityTypeAndEntityId(String entityType, Long entityId);
    
    // Combination search that looks in both old and new fields
    List<Image> findByTypeAndRelatedEntityIdOrEntityTypeAndEntityId(
        String type, Long relatedEntityId, String entityType, Long entityId);
}