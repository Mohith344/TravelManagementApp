package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.TravelAgency;
import com.example.travelmanagementapp.model.TravelPackage;
import com.example.travelmanagementapp.repository.TravelAgencyRepository;
import com.example.travelmanagementapp.repository.TravelPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TravelAgencyService {

    @Autowired
    private TravelAgencyRepository travelAgencyRepository;

    @Autowired
    private TravelPackageRepository travelPackageRepository;

    public void createTravelAgency(TravelAgency travelAgency) {
        travelAgencyRepository.save(travelAgency);
    }

    public List<TravelAgency> getAllTravelAgencies() {
        return travelAgencyRepository.findAll();
    }

    public TravelAgency getTravelAgencyById(Long id) {
        return travelAgencyRepository.findById(id).orElse(null);
    }

    public void updateTravelAgency(TravelAgency travelAgency) {
        travelAgencyRepository.save(travelAgency);
    }

    public void deleteTravelAgency(Long id) {
        travelAgencyRepository.deleteById(id);
    }

    public void createTravelPackage(TravelPackage travelPackage) {
        travelPackageRepository.save(travelPackage);
    }
}