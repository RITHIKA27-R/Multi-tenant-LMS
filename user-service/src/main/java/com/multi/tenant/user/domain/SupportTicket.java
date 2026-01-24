package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long tenantId;
    private String subject;
    private String description;
    @Enumerated(EnumType.STRING)
    private TicketStatus status; // OPEN, IN_PROGRESS, RESOLVED
    @Enumerated(EnumType.STRING)
    private TicketPriority priority; // LOW, MEDIUM, HIGH
    private LocalDateTime createdAt = LocalDateTime.now();
    private String createdBy; // Email
}
