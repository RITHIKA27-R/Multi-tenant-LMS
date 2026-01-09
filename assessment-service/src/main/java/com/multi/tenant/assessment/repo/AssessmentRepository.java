package com.multi.tenant.assessment.repo;

import com.multi.tenant.assessment.domain.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AssessmentRepository extends JpaRepository<Assessment, Long> {
    List<Assessment> findAllByTenantId(Long tenantId);
}
