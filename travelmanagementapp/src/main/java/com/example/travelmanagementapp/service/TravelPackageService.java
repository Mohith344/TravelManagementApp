package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelPackageService {

    @Autowired
    private TravelPackageRepository travelPackageRepository;

    public void createTravelPackage(TravelPackage travelPackage) {
        travelPackageRepository.save(travelPackage);
    }

    public List<TravelPackage> getAllTravelPackages() {
        return travelPackageRepository.findAll();
    }

    public TravelPackage getTravelPackageById(Long id) {
        return travelPackageRepository.findById(id).orElse(null);
    }

    public void updateTravelPackage(TravelPackage travelPackage) {
        travelPackageRepository.save(travelPackage);
    }

    public void deleteTravelPackage(Long id) {
        travelPackageRepository.deleteById(id);
    }
}