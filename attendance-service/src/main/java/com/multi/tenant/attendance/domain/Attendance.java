package com.multi.tenant.attendance.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance")
@Data
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId; // username
    private LocalDateTime clockIn;
    private LocalDateTime clockOut;
    private String date; // YYYY-MM-DD for grouping

    @Column(name = "tenant_id", nullable = false)
    private Long tenantId;
}
