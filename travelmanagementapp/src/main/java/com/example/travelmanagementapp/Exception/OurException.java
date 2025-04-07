package com.example.travelmanagementapp.Exception;

public class OurException extends RuntimeException{

    public OurException(String message) {
        super(message);
    }

    public OurException(String message, Throwable cause) {
        super(message, cause);
    }
}
