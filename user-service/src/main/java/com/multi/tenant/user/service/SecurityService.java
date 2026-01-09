package com.multi.tenant.user.service;

import com.multi.tenant.user.domain.IpRestriction;
import com.multi.tenant.user.domain.LoginAuditLog;
import com.multi.tenant.user.domain.RolePermission;
import com.multi.tenant.user.repo.IpRestrictionRepository;
import com.multi.tenant.user.repo.LoginAuditLogRepository;
import com.multi.tenant.user.repo.RolePermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SecurityService {

    @Autowired
    private IpRestrictionRepository ipRestrictionRepository;

    @Autowired
    private RolePermissionRepository rolePermissionRepository;

    @Autowired
    private LoginAuditLogRepository auditLogRepository;

    // --- Audit Logs ---
    public List<LoginAuditLog> getAllAuditLogs() {
        return auditLogRepository.findAll();
    }

    // --- IP Restrictions ---
    public List<IpRestriction> getIpRestrictions(Long tenantId) {
        if (tenantId == null) {
            return ipRestrictionRepository.findAll();
        }
        return ipRestrictionRepository.findByTenantId(tenantId);
    }

    public IpRestriction addIpRestriction(IpRestriction ipRestriction) {
        return ipRestrictionRepository.save(ipRestriction);
    }

    public void removeIpRestriction(Long id) {
        ipRestrictionRepository.deleteById(id);
    }

    public boolean isIpAllowed(String ipAddress, Long tenantId) {
        // Simple Allow List Implementation:
        // If no rules exist, allow all.
        // If rules exist, must match one allowed IP.

        List<IpRestriction> restrictions = ipRestrictionRepository.findByTenantId(tenantId);
        if (restrictions.isEmpty())
            return true;

        return restrictions.stream()
                .filter(IpRestriction::isAllowed)
                .anyMatch(r -> r.getIpAddress().equals(ipAddress));
    }

    // --- Role Permissions ---
    public List<RolePermission> getRolePermissions(Long tenantId) {
        if (tenantId == null) {
            return rolePermissionRepository.findAll();
        }
        return rolePermissionRepository.findByTenantId(tenantId);
    }

    public RolePermission updateRolePermission(RolePermission permission) {
        return rolePermissionRepository.save(permission);
    }
}
