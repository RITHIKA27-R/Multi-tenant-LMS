package com.multi.tenant.user.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
@lombok.Data
@lombok.NoArgsConstructor
@lombok.AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // SUPER_ADMIN, TENANT_ADMIN, LEARNER, INSTRUCTOR

    @Column(name = "tenant_id", nullable = true)
    private Long tenantId; // Null for Super Admin

    @Column(unique = true)
    private String email;

    private String status; // ACTIVE, PENDING, LOCKED
    private Integer failedLoginAttempts = 0;
    private java.time.LocalDateTime lastLoginTime;
    private String invitationToken;
}
