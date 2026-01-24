package com.multi.tenant.user.controller;

import com.multi.tenant.user.domain.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/super-admin")
@SuppressWarnings("null")
public class SuperAdminController {

    @Autowired
    private com.multi.tenant.user.repo.TenantRepository tenantRepository;

    @Autowired
    private com.multi.tenant.user.repo.UserRepository userRepository;

    @Autowired
    private com.multi.tenant.user.repo.SupportTicketRepository supportTicketRepository;

    @Autowired
    private com.multi.tenant.user.repo.SubscriptionPlanRepository subscriptionPlanRepository;

    @Autowired
    private com.multi.tenant.user.repo.AnnouncementRepository announcementRepository;

    @Autowired
    private com.multi.tenant.user.repo.LoginAuditLogRepository auditLogRepository;

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTenants", tenantRepository.count());
        stats.put("totalUsers", userRepository.count());
        stats.put("activeTenants", tenantRepository.count()); // Simplification
        stats.put("pendingTickets", supportTicketRepository.findAllByStatus(TicketStatus.OPEN).size());
        return stats;
    }

    @GetMapping("/analytics/growth")
    public List<Map<String, Object>> getTenantGrowth() {
        return List.of(
                Map.of("month", "Jan", "count", 4),
                Map.of("month", "Feb", "count", 7),
                Map.of("month", "Mar", "count", 12),
                Map.of("month", "Apr", "count", 18),
                Map.of("month", "May", "count", 25));
    }

    @GetMapping("/tickets")
    public List<SupportTicket> getTickets() {
        return supportTicketRepository.findAll();
    }

    @PostMapping("/tickets")
    public @org.springframework.lang.NonNull SupportTicket createTicket(@RequestBody SupportTicket ticket) {
        ticket.setCreatedAt(java.time.LocalDateTime.now());
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }
        if (ticket.getPriority() == null) {
            ticket.setPriority(TicketPriority.MEDIUM);
        }
        return supportTicketRepository.save(ticket);
    }

    @PutMapping("/tickets/{id}/status")
    public SupportTicket updateTicketStatus(@PathVariable("id") @org.springframework.lang.NonNull Long id,
            @RequestParam("status") TicketStatus status) {
        SupportTicket ticket = supportTicketRepository.findById(id).orElseThrow();
        ticket.setStatus(status);
        return supportTicketRepository.save(ticket);
    }

    @GetMapping("/tickets/tenant/{tenantId}")
    public List<SupportTicket> getTicketsByTenant(
            @PathVariable("tenantId") @org.springframework.lang.NonNull Long tenantId) {
        return supportTicketRepository.findAllByTenantId(tenantId);
    }

    @PostMapping("/announcements")
    public @org.springframework.lang.NonNull Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    @GetMapping("/audit-logs")
    public @org.springframework.lang.NonNull List<LoginAuditLog> getAuditLogs() {
        return auditLogRepository.findAll();
    }

    @GetMapping("/plans")
    public @org.springframework.lang.NonNull List<SubscriptionPlan> getPlans() {
        return subscriptionPlanRepository.findAll();
    }

    @PostMapping("/plans")
    public @org.springframework.lang.NonNull SubscriptionPlan createPlan(@RequestBody SubscriptionPlan plan) {
        return subscriptionPlanRepository.save(plan);
    }

    @PutMapping("/plans/{id}")
    public @org.springframework.lang.NonNull SubscriptionPlan updatePlan(
            @PathVariable("id") @org.springframework.lang.NonNull Long id,
            @RequestBody SubscriptionPlan planDetails) {
        SubscriptionPlan plan = subscriptionPlanRepository.findById(id).orElseThrow();
        plan.setName(planDetails.getName());
        plan.setUserLimit(planDetails.getUserLimit());
        plan.setStorageLimit(planDetails.getStorageLimit());
        plan.setPrice(planDetails.getPrice());
        return subscriptionPlanRepository.save(plan);
    }

    @DeleteMapping("/plans/{id}")
    public void deletePlan(@PathVariable("id") @org.springframework.lang.NonNull Long id) {
        subscriptionPlanRepository.deleteById(id);
    }

    @GetMapping("/admins")
    public @org.springframework.lang.NonNull List<User> getAdmins() {
        return userRepository.findAll().stream()
                .filter(u -> Role.TENANT_ADMIN.equals(u.getRole()))
                .toList();
    }

    @PostMapping("/admins/{id}/status")
    public @org.springframework.lang.NonNull User updateAdminStatus(
            @PathVariable("id") @org.springframework.lang.NonNull Long id,
            @RequestParam("status") Status status) {
        User user = userRepository.findById(id).orElseThrow();
        user.setStatus(status);
        return userRepository.save(user);
    }
}
