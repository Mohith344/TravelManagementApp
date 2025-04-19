package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.ImageRepository;
import com.example.travelmanagementapp.repository.UserRepository;
import com.example.travelmanagementapp.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/images")
public class ImageController {
    @Autowired
    private ImageService imageService;
    
    @Autowired
    private ImageRepository imageRepository;
    
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
    
    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        Resource resource = imageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            System.out.println("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
    
    @GetMapping("/by-type/{type}/{entityId}")
    public ResponseEntity<List<String>> getImagesByTypeAndEntityId(
            @PathVariable String type, 
            @PathVariable Long entityId) {
        
        List<Image> images = imageRepository.findByTypeAndRelatedEntityId(type, entityId);
        
        List<String> imageUrls = images.stream()
                .map(image -> ServletUriComponentsBuilder.fromCurrentContextPath()
                        .path("/images/")
                        .path(image.getFilename())
                        .toUriString())
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(imageUrls);
    }
}