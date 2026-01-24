package com.multi.tenant.user.controller;

import com.multi.tenant.user.domain.IpRestriction;
import com.multi.tenant.user.domain.LoginAuditLog;
import com.multi.tenant.user.domain.RolePermission;
import com.multi.tenant.user.service.SecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/security")
@SuppressWarnings("null")
public class SecurityController {

    @Autowired
    private SecurityService securityService;

    // Audit Logs
    @GetMapping("/audit-logs")
    public List<LoginAuditLog> getAuditLogs() {
        return securityService.getAllAuditLogs();
    }

    // IP Restrictions
    @GetMapping("/ip-restrictions")
    public List<IpRestriction> getIpRestrictions(@RequestParam(required = false) Long tenantId) {
        System.out.println("DEBUG: getIpRestrictions called with tenantId: " + tenantId);
        List<IpRestriction> list = securityService.getIpRestrictions(tenantId);
        System.out.println("DEBUG: Found " + list.size() + " restrictions");
        return list;
    }

    @GetMapping("/ips-test")
    public String test() {
        return "OK";
    }

    @PostMapping("/ip-restrictions")
    public IpRestriction addIpRestriction(@RequestBody IpRestriction ipRestriction) {
        return securityService.addIpRestriction(ipRestriction);
    }

    @DeleteMapping("/ip-restrictions/{id}")
    public void deleteIpRestriction(@PathVariable Long id) {
        securityService.removeIpRestriction(id);
    }

    // Role Permissions
    @GetMapping("/permissions")
    public List<RolePermission> getRolePermissions(@RequestParam(required = false) Long tenantId) {
        return securityService.getRolePermissions(tenantId);
    }

    @PostMapping("/permissions")
    public RolePermission updateRolePermission(@RequestBody RolePermission permission) {
        return securityService.updateRolePermission(permission);
    }
}
