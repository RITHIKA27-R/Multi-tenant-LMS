package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.IpRestriction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IpRestrictionRepository extends JpaRepository<IpRestriction, Long> {
    List<IpRestriction> findByTenantId(Long tenantId);
}
