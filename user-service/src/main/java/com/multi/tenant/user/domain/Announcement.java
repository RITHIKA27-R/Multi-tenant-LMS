package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String message;
    private String target; // ALL, TENANT_ADMINS, LEARNERS
    private LocalDateTime publishedAt = LocalDateTime.now();
    private Boolean active = true;
}
