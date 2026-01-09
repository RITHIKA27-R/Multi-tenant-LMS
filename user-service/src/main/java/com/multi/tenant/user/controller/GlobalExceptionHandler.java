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
        Map<String, String> error = new HashMap<>();
        error.put("error", e.getMessage());

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        if (e.getMessage().contains("Invalid credentials") ||
                e.getMessage().contains("User not found") ||
                e.getMessage().contains("Account is locked") ||
                e.getMessage().contains("Account pending")) {
            status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(error, status);
    }
}
