package com.multi.tenant.assessment.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_attempts")
@Data
public class TestAttempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assessmentId;
    private String learnerUsername;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    // IN_PROGRESS, COMPLETED
    private String status;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String answersJson; // Store answers here

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
}
