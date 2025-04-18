package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Image;
import com.example.travelmanagementapp.model.User;
import com.example.travelmanagementapp.repository.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ImageService {
    @Autowired
    private ImageRepository imageRepository;

    public Image saveImage(String filename, User uploader) {
        Image image = new Image();
        image.setFilename(filename);
        image.setUploader(uploader);
        image.setUploadDate(LocalDateTime.now());
        return imageRepository.save(image);
    }
}