package com.multi.tenant.assessment.repo;

import com.multi.tenant.assessment.domain.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findAllByTenantId(Long tenantId);

    List<Submission> findAllByTenantIdAndAssessmentId(Long tenantId, Long assessmentId);
}
