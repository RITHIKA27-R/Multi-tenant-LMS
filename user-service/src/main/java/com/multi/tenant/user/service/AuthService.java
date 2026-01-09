package com.multi.tenant.user.service;

import com.multi.tenant.user.domain.User;
import com.multi.tenant.user.repo.UserRepository;
import com.multi.tenant.user.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

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
        if (user.getTenantId() != null && !securityService.isIpAllowed(ipAddress, user.getTenantId())) { // Only check
                                                                                                         // if tenant
                                                                                                         // exists and
                                                                                                         // restrictions
                                                                                                         // apply
            System.out.println("Login failed: IP not allowed - " + ipAddress);
            auditLogin(user, "BLOCKED_IP", ipAddress);
            throw new RuntimeException("Login not allowed from this IP address.");
        }

        if ("LOCKED".equals(user.getStatus())) {
            System.out.println("Login failed: Account locked - " + email);
            throw new RuntimeException("Account is locked due to multiple failed attempts.");
        }

        if ("PENDING".equals(user.getStatus())) {
            System.out.println("Login failed: Account pending - " + email);
            throw new RuntimeException("Account pending. Please set password via invitation link.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("Login failed: Invalid password - " + email);
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);
            if (user.getFailedLoginAttempts() >= 5) {
                user.setStatus("LOCKED");
            }
            userRepository.save(user);
            auditLogin(user, "FAILED", ipAddress);
            throw new RuntimeException("Invalid credentials");
        }

        System.out.println("Login successful for user: " + email);
        user.setFailedLoginAttempts(0);
        user.setLastLoginTime(java.time.LocalDateTime.now());
        userRepository.save(user);
        auditLogin(user, "SUCCESS", ipAddress);

        return jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getTenantId());
    }

    private void auditLogin(User user, String status, String ipAddress) {
        com.multi.tenant.user.domain.LoginAuditLog log = new com.multi.tenant.user.domain.LoginAuditLog();
        log.setEmail(user.getEmail());
        log.setTenantId(user.getTenantId());
        log.setLoginTime(java.time.LocalDateTime.now());
        log.setStatus(status);
        log.setIpAddress(ipAddress);
        auditLogRepository.save(log);
    }

    public void setPasswordFromInvitation(String token, String newPassword) {
        User user = userRepository.findByInvitationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired invitation token"));

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setStatus("ACTIVE");
        user.setInvitationToken(null);
        userRepository.save(user);
    }

    public Long getTenantIdByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return user.getTenantId();
    }
}
