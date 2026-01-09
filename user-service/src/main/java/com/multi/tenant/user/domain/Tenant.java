package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String identifier;

    private String planType; // FREE, PRO, ENTERPRISE
    private Integer userLimit;
    private Long storageLimit; // In MB
    private java.time.LocalDate expiryDate;
    private String brandingColor;
    private String brandingLogo;
}
