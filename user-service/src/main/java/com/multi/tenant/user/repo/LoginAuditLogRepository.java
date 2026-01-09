package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.LoginAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

public interface LoginAuditLogRepository extends JpaRepository<LoginAuditLog, Long> {
    @Transactional
    void deleteByTenantId(Long tenantId);

    @Modifying
    @Transactional
    @org.springframework.data.jpa.repository.Query("DELETE FROM LoginAuditLog l WHERE l.tenantId = :tenantId")
    int deleteByTenantIdExplicit(@org.springframework.data.repository.query.Param("tenantId") Long tenantId);
}
