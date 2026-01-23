package com.multi.tenant.user.controller;

import com.multi.tenant.user.domain.User;
import com.multi.tenant.user.repo.UserRepository;
import com.multi.tenant.user.filter.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAllByTenantId(TenantContext.getTenantId());
    }

    @PostMapping("/invite")
    public User inviteUser(@RequestBody User inviteRequest) {
        User user = new User();
        user.setEmail(inviteRequest.getEmail());
        user.setUsername(inviteRequest.getEmail());
        user.setRole(inviteRequest.getRole() != null ? inviteRequest.getRole() : "LEARNER");
        user.setTenantId(TenantContext.getTenantId());
        user.setStatus("PENDING");
        user.setPassword(UUID.randomUUID().toString()); // Placeholder, effectively unusable
        user.setInvitationToken(UUID.randomUUID().toString());

        System.out.println("Invitation Link: " + frontendUrl + "/set-password?token=" + user.getInvitationToken());

        return userRepository.save(user);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable("id") Long id) {
        User user = userRepository.findById(id).orElseThrow();
        if (user.getTenantId().equals(TenantContext.getTenantId())) {
            userRepository.delete(user);
            return "User deleted";
        }
        throw new RuntimeException("Unauthorized");
    }

    @PostMapping("/change-password")
    public Map<String, String> changePassword(
            @RequestHeader(value = "X-User-Name") String username,
            @RequestBody Map<String, String> request) {

        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            throw new RuntimeException("Old password and new password are required");
        }

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify tenant ID matches
        if (!user.getTenantId().equals(TenantContext.getTenantId())) {
            throw new RuntimeException("Unauthorized");
        }

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return Map.of("message", "Password changed successfully");
    }
}
