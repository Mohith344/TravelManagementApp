package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.ImageRepository;
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
        image.setFilename(filename);
        image.setUploader(uploader);
        image.setUploadDate(LocalDateTime.now());
        return imageRepository.save(image);
    }
    
    public List<String> savePackageImages(List<MultipartFile> images, User uploader, String type) throws IOException {
        List<String> fileNames = new ArrayList<>();
        
        if (images != null) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String fileName = StringUtils.cleanPath(image.getOriginalFilename());
                    String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
                    
                    // Save to filesystem
                    Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
                    Files.copy(image.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
                    
                    // Save reference in database
                    Image imageEntity = new Image();
                    imageEntity.setFilename(uniqueFileName);
                    imageEntity.setUploader(uploader);
                    imageEntity.setUploadDate(LocalDateTime.now());
                    imageEntity.setType(type); // "restaurant", "hotel", etc.
                    imageRepository.save(imageEntity);
                    
                    fileNames.add(uniqueFileName);
                }
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