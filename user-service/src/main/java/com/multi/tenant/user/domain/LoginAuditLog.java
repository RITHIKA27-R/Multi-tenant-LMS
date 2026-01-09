package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "login_audit_logs")
@Data
public class LoginAuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private Long tenantId;
    private LocalDateTime loginTime;
    private String ipAddress;
    private String status; // SUCCESS, FAILED
}
