package com.multi.tenant.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException e) {
        // Log the full stack trace so we can see it in Render logs
        e.printStackTrace();

        Map<String, String> error = new HashMap<>();
        String message = e.getMessage();

        // Handle null messages (e.g., from NullPointerException)
        if (message == null) {
            message = "Internal Server Error (No detailed message available). Check logs for NullPointerException.";
            if (e instanceof NullPointerException) {
                message = "NullPointerException occurred in the server.";
            }
        }

        error.put("error", message);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        // Use the safe 'message' variable instead of e.getMessage()
        if (message.contains("Invalid credentials") ||
                message.contains("User not found") ||
                message.contains("Account is locked") ||
                message.contains("Account pending")) {
            status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(error, status);
    }
}
