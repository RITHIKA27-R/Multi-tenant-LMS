package com.multi.tenant.user.controller;

import com.multi.tenant.user.dto.AuthRequest;
import com.multi.tenant.user.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest request, jakarta.servlet.http.HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = httpRequest.getRemoteAddr();
        }
        return authService.login(request.getEmail(), request.getPassword(), ipAddress);
    }

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {
        return authService.register(request.getEmail(), request.getPassword());
    }

    @GetMapping("/lookup")
    public Long lookupTenant(@RequestParam("email") String email) {
        return authService.getTenantIdByEmail(email);
    }

    @PostMapping("/set-password")
    public String setPassword(@RequestBody java.util.Map<String, String> payload) {
        authService.setPasswordFromInvitation(payload.get("token"), payload.get("password"));
        return "Password set successfully";
    }
}
