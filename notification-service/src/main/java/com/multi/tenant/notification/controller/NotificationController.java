package com.multi.tenant.notification.controller;

import com.multi.tenant.notification.context.TenantContext;
import com.multi.tenant.notification.domain.Notification;
import com.multi.tenant.notification.repo.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public List<Notification> getNotifications() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null)
            throw new RuntimeException("Tenant ID missing");
        return notificationRepository.findAllByTenantId(tenantId);
    }

    @PostMapping
    public Notification sendNotification(@RequestBody Notification notification) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null)
            throw new RuntimeException("Tenant ID missing");
        notification.setTenantId(tenantId);
        return notificationRepository.save(notification);
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "notification-service",
                "tenantId", TenantContext.getTenantId() != null ? TenantContext.getTenantId() : "NONE");
    }
}
