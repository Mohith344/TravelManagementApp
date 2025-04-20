package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.ImageRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private final Path fileStorageLocation;
    
    public ImageService() {
        this.fileStorageLocation = Paths.get("uploads")
                .toAbsolutePath().normalize();
        
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public Image saveImage(String filename, User uploader) {
        Image image = new Image();
        image.setFilePath(filename);
        image.setFilename(filename.substring(filename.lastIndexOf('/') + 1));
        image.setUploader(uploader);
        image.setUploadDate(LocalDateTime.now()); // Set the required upload date
        image.setEntityType("general"); // Set a default entity type
        image.setEntityId(0L); // Set a default entity ID
        // Set legacy fields too
        image.setType("general");
        image.setRelatedEntityId(0L);
        return imageRepository.save(image);
    }
    
    public String saveImage(MultipartFile image, String type, Long entityId) throws IOException {
        return saveImage(image, type, entityId, "admin"); // Use default admin user
    }
    
    public String saveImage(MultipartFile file, String entityType, Long entityId, String username) throws IOException {
        // Find the user by username
        User uploader = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
            
        // Create directory if it doesn't exist
        String uploadDir = "uploads/" + entityType;
        File dir = new File(uploadDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        
        // Generate unique filename
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Create image record with ALL required fields
        Image image = new Image();
        image.setFilePath(uploadDir + "/" + filename);
        image.setFilename(filename);
        image.setEntityType(entityType);
        image.setEntityId(entityId);
        image.setUploader(uploader);
        image.setUploadDate(LocalDateTime.now()); // Set the required upload date
        
        // Set legacy fields for backward compatibility
        image.setType(entityType);
        image.setRelatedEntityId(entityId);
        
        imageRepository.save(image);
        
        return uploadDir + "/" + filename; // Return the relative path, not the absolute Path object
    }
    
    public List<String> savePackageImages(List<MultipartFile> images, User uploader, String type) throws IOException {
        return savePackageImages(images, uploader, type, null);
    }
    
    public List<String> savePackageImages(List<MultipartFile> images, User uploader, String type, Long packageId) throws IOException {
        List<String> fileNames = new ArrayList<>();
        
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                String uploadDir = "uploads/packages/" + type;
                File dir = new File(uploadDir);
                if (!dir.exists()) {
                    dir.mkdirs();
                }
                
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, filename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                Image image = new Image();
                image.setFilePath(uploadDir + "/" + filename);
                image.setFilename(filename);
                image.setEntityType("package_" + type);
                image.setUploader(uploader);
                image.setUploadDate(LocalDateTime.now());
                
                // Set the entity ID if provided
                if (packageId != null) {
                    image.setEntityId(packageId);
                    image.setRelatedEntityId(packageId); // Set legacy field too
                } else {
                    image.setEntityId(0L); // Default value if no ID provided
                    image.setRelatedEntityId(0L);
                }
                
                // Set legacy fields for backward compatibility
                image.setType("package_" + type);
                
                imageRepository.save(image);
                
                fileNames.add(uploadDir + "/" + filename);
            }
        }
        
        return fileNames;
    }
    
    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new RuntimeException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new RuntimeException("File not found " + fileName, ex);
        }
    }
}