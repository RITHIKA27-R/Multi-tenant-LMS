package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.RolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RolePermissionRepository extends JpaRepository<RolePermission, Long> {
    List<RolePermission> findByTenantId(Long tenantId);

    Optional<RolePermission> findByRoleAndModuleAndTenantId(String role, String module, Long tenantId);
}
