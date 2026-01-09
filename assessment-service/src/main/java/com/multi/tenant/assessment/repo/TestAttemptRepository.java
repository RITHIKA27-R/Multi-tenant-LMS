package com.multi.tenant.assessment.repo;

import com.multi.tenant.assessment.domain.TestAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TestAttemptRepository extends JpaRepository<TestAttempt, Long> {
    List<TestAttempt> findAllByTenantId(Long tenantId);

    Optional<TestAttempt> findByLearnerUsernameAndAssessmentIdAndTenantId(String learnerUsername, Long assessmentId,
            Long tenantId);
}
