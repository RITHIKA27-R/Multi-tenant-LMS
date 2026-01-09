package com.multi.tenant.assessment.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "assessments")
@Data
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Long courseId;

    @Column(name = "questions_json", columnDefinition = "TEXT")
    private String questionsJson; // JSON string of questions/options

    private Integer durationMinutes;
    private Integer totalQuestions;
    private String status; // ACTIVE, DRAFT

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
}
