package com.example.travelmanagementapp.service;

import com.example.travelmanagementapp.model.Booking;
import com.example.travelmanagementapp.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    
    public Booking createBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public void cancelBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}