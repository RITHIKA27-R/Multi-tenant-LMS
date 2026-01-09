package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Tenant findByIdentifier(String identifier);
}
