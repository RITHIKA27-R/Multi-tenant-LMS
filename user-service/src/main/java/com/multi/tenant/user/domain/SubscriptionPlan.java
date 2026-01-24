package com.multi.tenant.user.domain;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class SubscriptionPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private PlanType name; // FREE, PRO, ENTERPRISE
    private Integer userLimit;
    private Long storageLimit; // MB
    private Double price;
}
