package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ip_restrictions")
@Data
public class IpRestriction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ipAddress;
    private String description; // e.g., "Office Network"
    private boolean allowed; // true = allow list, false = block list (usually whitelist approach is safer)
    private Long tenantId; // Null for global (Super Admin), specific for tenants
    private LocalDateTime createdAt = LocalDateTime.now();
}
