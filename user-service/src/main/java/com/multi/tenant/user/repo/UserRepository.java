package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByInvitationToken(String invitationToken);

    List<User> findAllByTenantId(Long tenantId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    void deleteByTenantId(Long tenantId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Query("DELETE FROM User u WHERE u.tenantId = :tenantId")
    int deleteByTenantIdExplicit(@org.springframework.data.repository.query.Param("tenantId") Long tenantId);
}
