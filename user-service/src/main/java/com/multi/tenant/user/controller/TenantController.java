package com.multi.tenant.user.controller;

import com.multi.tenant.user.domain.Tenant;
import com.multi.tenant.user.domain.User;
import com.multi.tenant.user.repo.TenantRepository;
import com.multi.tenant.user.repo.UserRepository;
import com.multi.tenant.user.repo.LoginAuditLogRepository;
import com.multi.tenant.user.repo.SupportTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/tenants")
public class TenantController {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginAuditLogRepository auditLogRepository;

    @Autowired
    private SupportTicketRepository supportTicketRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private com.multi.tenant.user.service.EmailService emailService;

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;

    @GetMapping
    public List<Tenant> getAllTenants() {
        return tenantRepository.findAll();
    }

    @PostMapping
    public Tenant createTenant(@RequestBody Tenant tenant) {
        return tenantRepository.save(tenant);
    }

    @PutMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public Tenant updateTenant(@PathVariable("id") Long id, @RequestBody Tenant tenantDetails) {
        System.out.println("UPDATING TENANT ID: " + id);
        Tenant tenant = tenantRepository.findById(id).orElseThrow();
        tenant.setName(tenantDetails.getName());
        tenant.setPlanType(tenantDetails.getPlanType());
        Tenant updated = tenantRepository.save(tenant);
        System.out.println("TENANT UPDATED SUCCESSFULLY: " + updated.getId());
        return updated;
    }

    @DeleteMapping("/{id}")
    @org.springframework.transaction.annotation.Transactional
    public org.springframework.http.ResponseEntity<String> deleteTenant(@PathVariable("id") Long id) {
        System.out.println("--- START DELETING TENANT ID: " + id + " ---");
        try {
            // Delete associated data first
            int auditLogsDeleted = auditLogRepository.deleteByTenantIdExplicit(id);
            System.out.println("Deleted audit logs: " + auditLogsDeleted);

            int ticketsDeleted = supportTicketRepository.deleteByTenantIdExplicit(id);
            System.out.println("Deleted support tickets: " + ticketsDeleted);

            int usersDeleted = userRepository.deleteByTenantIdExplicit(id);
            System.out.println("Deleted users: " + usersDeleted);

            tenantRepository.deleteById(id);
            System.out.println("Tenant entity deleted successfully.");

            System.out.println("--- FINISHED DELETING TENANT ID: " + id + " ---");
            return org.springframework.http.ResponseEntity.ok("Tenant and all associated data deleted successfully");
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR DURING TENANT DELETE: " + e.getMessage());
            e.printStackTrace();
            throw e; // Caught by handleException
        }
    }

    @ExceptionHandler(Exception.class)
    public org.springframework.http.ResponseEntity<String> handleException(Exception e) {
        System.err.println("ERROR IN TENANT CONTROLLER: " + e.getMessage());
        e.printStackTrace();
        return org.springframework.http.ResponseEntity.internalServerError().body(e.getMessage());
    }

    @PostMapping("/{tenantId}/invite-admin")
    @org.springframework.transaction.annotation.Transactional
    public User inviteTenantAdmin(@PathVariable("tenantId") Long tenantId, @RequestBody User adminRequest) {
        User admin = new User();
        admin.setEmail(adminRequest.getEmail());
        admin.setUsername(adminRequest.getEmail());
        admin.setRole("TENANT_ADMIN");
        admin.setTenantId(tenantId);
        admin.setStatus("PENDING");
        admin.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Placeholder
        admin.setInvitationToken(UUID.randomUUID().toString());

        // Send email
        String link = frontendUrl + "/set-password?token=" + admin.getInvitationToken();
        System.out.println("Invitation Link (Console Fallback): " + link);

        emailService.sendInvitationEmail(admin.getEmail(), link);

        return userRepository.save(admin);
    }

    @GetMapping("/analytics/usage")
    public Object getGlobalUsage() {
        return List.of(
                Map.of("tenant", "Acme Corp", "users", 45, "storage", "1.2GB"),
                Map.of("tenant", "Beta Updates", "users", 12, "storage", "400MB"));
    }
}
