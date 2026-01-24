package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.SupportTicket;
import com.multi.tenant.user.domain.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface SupportTicketRepository extends JpaRepository<SupportTicket, Long> {
    List<SupportTicket> findAllByStatus(TicketStatus status);

    List<SupportTicket> findAllByTenantId(Long tenantId);

    @Transactional
    void deleteByTenantId(Long tenantId);

    @Modifying
    @Transactional
    @org.springframework.data.jpa.repository.Query("DELETE FROM SupportTicket s WHERE s.tenantId = :tenantId")
    int deleteByTenantIdExplicit(@org.springframework.data.repository.query.Param("tenantId") Long tenantId);
}
