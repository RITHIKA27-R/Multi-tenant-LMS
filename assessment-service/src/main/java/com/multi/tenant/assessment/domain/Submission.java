package com.multi.tenant.assessment.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
@Data
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long assessmentId;
    private String studentUsername;
    private Integer score;
    private String status; // PENDING, GRADED

    @Column(columnDefinition = "TEXT")
    private String answersJson;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;

    private LocalDateTime submittedAt = LocalDateTime.now();
}
