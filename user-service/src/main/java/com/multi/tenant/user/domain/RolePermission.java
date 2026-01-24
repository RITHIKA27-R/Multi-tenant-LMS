package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "role_permissions")
@Data
public class RolePermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Role role; // SUPER_ADMIN, TENANT_ADMIN, LEARNER
    @Enumerated(EnumType.STRING)
    private PermissionModule module; // e.g., "USERS", "COURSES", "BILLING"
    private boolean canCreate;
    private boolean canRead;
    private boolean canUpdate;
    private boolean canDelete;
    private Long tenantId; // specific tenant customizations or null for defaults
}
