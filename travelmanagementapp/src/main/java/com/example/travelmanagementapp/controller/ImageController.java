package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageService imageService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, @RequestParam Long uploaderId) throws IOException {
        Optional<User> userOpt = userRepository.findById(uploaderId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid uploader ID");
        }
        User uploader = userOpt.get();
        // Only allow ADMIN or TRAVEL_AGENCY
        if (!("ROLE_ADMIN".equals(uploader.getRole()) || "ROLE_TRAVEL_AGENCY".equals(uploader.getRole()))) {
            return ResponseEntity.status(403).body("Only admin or travel agency can upload images");
        }
        String uploadDir = "uploads";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();
        String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        File dest = new File(dir, filename);
        file.transferTo(dest);
        imageService.saveImage(filename, uploader);
        return ResponseEntity.ok("Image uploaded successfully: " + filename);
    }
}