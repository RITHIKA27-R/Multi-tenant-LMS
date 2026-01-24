package com.multi.tenant.user.service;

import com.multi.tenant.user.domain.*;
import com.multi.tenant.user.domain.Role;
import com.multi.tenant.user.domain.Status;
import com.multi.tenant.user.domain.LoginStatus;
import com.multi.tenant.user.repo.UserRepository;
import com.multi.tenant.user.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthService {

    private static final int MAX_FAILED_ATTEMPTS = 5;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private com.multi.tenant.user.repo.LoginAuditLogRepository auditLogRepository;

    @Autowired
    private SecurityService securityService;

    public String login(String email, String password, String ipAddress) {
        System.out.println("Login attempt for email: " + email + " from IP: " + ipAddress);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    System.out.println("Login failed: User not found - " + email);
                    return new RuntimeException("User not found");
                });

        // IP Restriction Check
        if (user.getTenantId() != null && !securityService.isIpAllowed(ipAddress, user.getTenantId())) {
            System.out.println("Login failed: IP not allowed - " + ipAddress);
            auditLogin(user, LoginStatus.BLOCKED_IP, ipAddress);
            throw new RuntimeException("Login not allowed from this IP address.");
        }

        // Status checks
        if (Status.LOCKED.equals(user.getStatus())) {
            System.out.println("Login failed: Account locked - " + email);
            throw new RuntimeException("Account is locked due to multiple failed attempts.");
        }
        if (Status.PENDING.equals(user.getStatus())) {
            System.out.println("Login failed: Account pending - " + email);
            throw new RuntimeException("Account pending. Please set password via invitation link.");
        }

        // Password validation
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Login failed: Invalid password - " + email);
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setStatus(Status.LOCKED);
                System.out.println("User account locked due to max failed attempts: " + email);
            }
            userRepository.save(user);
            auditLogin(user, LoginStatus.FAILED, ipAddress);
            throw new RuntimeException("Invalid credentials");
        }

        // Successful login
        System.out.println("Login successful for user: " + email);
        user.setFailedLoginAttempts(0);
        user.setLastLoginTime(LocalDateTime.now());
        userRepository.save(user);
        auditLogin(user, LoginStatus.SUCCESS, ipAddress);

        return jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getTenantId());
    }

    private void auditLogin(User user, LoginStatus status, String ipAddress) {
        com.multi.tenant.user.domain.LoginAuditLog log = new com.multi.tenant.user.domain.LoginAuditLog();
        log.setEmail(user.getEmail());
        log.setTenantId(user.getTenantId());
        log.setLoginTime(LocalDateTime.now());
        log.setStatus(status);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }

    public void setPasswordFromInvitation(String token, String newPassword) {
        User user = userRepository.findByInvitationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invitation token"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setStatus(Status.ACTIVE);
        user.setInvitationToken(null);
        userRepository.save(user);
    }

    public Long getTenantIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getTenantId();
    }

    public String register(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setUsername(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(Role.LEARNER);
        user.setTenantId(1L); // Defaulting to Tenant 1 for self-registration
        user.setStatus(Status.ACTIVE);
        user.setFailedLoginAttempts(0);

        userRepository.save(user);
        System.out.println("User registered successfully: " + email);

        return jwtUtil.generateToken(user.getUsername(), user.getRole().name(), user.getTenantId());
    }
}
