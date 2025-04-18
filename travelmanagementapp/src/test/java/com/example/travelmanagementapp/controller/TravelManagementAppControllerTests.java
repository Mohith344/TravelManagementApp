package com.example.travelmanagementapp.controller;

import com.example.travelmanagementapp.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TravelManagementAppControllerTests {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testUserEndpoints() {
        // Test user registration
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password123");
        user.setEmail("testuser@example.com");
        user.setRole("TRAVELLER");

        ResponseEntity<String> registerResponse = restTemplate.postForEntity("/users/register", user, String.class);
        assertThat(registerResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Test user login
        ResponseEntity<String> loginResponse = restTemplate.postForEntity("/users/login?username=testuser&password=password123", null, String.class);
        assertThat(loginResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void testBookingEndpoints() {
        // Test creating a booking
        Booking booking = new Booking();
        booking.setBookingDate(LocalDate.now());
        booking.setTravelDate(LocalDate.now().plusDays(10));
        booking.setTotalPrice(500.0);

        ResponseEntity<String> createResponse = restTemplate.postForEntity("/bookings", booking, String.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Test retrieving bookings for a user
        ResponseEntity<List> getResponse = restTemplate.getForEntity("/bookings/user/1", List.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void testTravelPackageEndpoints() {
        // Test creating a travel package
        TravelPackage travelPackage = new TravelPackage();
        travelPackage.setName("Beach Vacation");
        travelPackage.setDescription("A relaxing beach vacation package");
        travelPackage.setPrice(1000.0);

        ResponseEntity<String> createResponse = restTemplate.postForEntity("/travel-packages", travelPackage, String.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Test retrieving all travel packages
        ResponseEntity<List> getResponse = restTemplate.getForEntity("/travel-packages", List.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void testTravelAgencyEndpoints() {
        // Test creating a travel agency
        TravelAgency travelAgency = new TravelAgency();
        travelAgency.setName("Global Travels");
        travelAgency.setContactInfo("contact@globaltravels.com");

        ResponseEntity<String> createResponse = restTemplate.postForEntity("/travel-agencies", travelAgency, String.class);
        assertThat(createResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Test retrieving all travel agencies
        ResponseEntity<List> getResponse = restTemplate.getForEntity("/travel-agencies", List.class);
        assertThat(getResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}