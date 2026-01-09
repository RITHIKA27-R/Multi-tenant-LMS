package com.multi.tenant.assessment.controller;

import com.multi.tenant.assessment.context.TenantContext;
import com.multi.tenant.assessment.domain.Assessment;
import com.multi.tenant.assessment.repo.AssessmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/assessments")
public class AssessmentController {

    @Autowired
    private AssessmentRepository assessmentRepository;

    @Autowired
    private com.multi.tenant.assessment.repo.SubmissionRepository submissionRepository;

    @Autowired
    private com.multi.tenant.assessment.repo.TestAttemptRepository testAttemptRepository;

    @GetMapping
    public List<Assessment> getAssessments() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null)
            throw new RuntimeException("Tenant ID missing");
        return assessmentRepository.findAllByTenantId(tenantId);
    }

    @GetMapping("/submissions")
    public List<com.multi.tenant.assessment.domain.Submission> getSubmissions() {
        Long tenantId = TenantContext.getTenantId();
        return submissionRepository.findAllByTenantId(tenantId);
    }

    @PostMapping
    public Assessment createAssessment(@RequestBody Assessment assessment) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null)
            throw new RuntimeException("Tenant ID missing");
        assessment.setTenantId(tenantId);
        return assessmentRepository.save(assessment);
    }

    @PostMapping("/submit")
    public com.multi.tenant.assessment.domain.Submission submitAssessment(
            @RequestBody Map<String, Object> submissionData) {
        Long tenantId = TenantContext.getTenantId();

        Long assessmentId = Long.valueOf(submissionData.get("assessmentId").toString());
        String username = (String) submissionData.get("username");

        com.multi.tenant.assessment.domain.Submission submission = new com.multi.tenant.assessment.domain.Submission();
        submission.setAssessmentId(assessmentId);
        submission.setStudentUsername(username);
        submission.setTenantId(tenantId);
        submission.setStatus("GRADED");
        submission.setScore(100); // Simple auto-grade for now
        submission.setFeedback("Successfully submitted!");

        return submissionRepository.save(submission);
    }

    @PostMapping("/grade/{id}")
    public com.multi.tenant.assessment.domain.Submission gradeSubmission(@PathVariable("id") Long id,
            @RequestBody Map<String, Object> gradeData) {
        Long tenantId = TenantContext.getTenantId();
        com.multi.tenant.assessment.domain.Submission submission = submissionRepository.findById(id)
                .filter(s -> s.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setScore(Integer.valueOf(gradeData.get("score").toString()));
        submission.setFeedback((String) gradeData.get("feedback"));
        submission.setStatus("GRADED");

        return submissionRepository.save(submission);
    }

    @DeleteMapping("/{id}")
    public void deleteAssessment(@PathVariable("id") Long id) {
        Long tenantId = TenantContext.getTenantId();
        Assessment a = assessmentRepository.findById(id)
                .filter(x -> x.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Assessment not found or access denied"));
        assessmentRepository.delete(a);
    }

    // --- New Learner Flow ---

    @PostMapping("/{testId}/start")
    public com.multi.tenant.assessment.domain.TestAttempt startAssessment(
            @PathVariable Long testId,
            @RequestHeader(value = "X-User-Name", defaultValue = "student") String username) {
        Long tenantId = TenantContext.getTenantId();

        Assessment assessment = assessmentRepository.findById(testId)
                .filter(a -> a.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Assessment not found"));

        // Check if incomplete attempt exists
        /*
         * Optional<TestAttempt> existing =
         * testAttemptRepository.findByLearnerUsernameAndAssessmentIdAndTenantId(
         * username, testId, tenantId);
         * if (existing.isPresent() && "IN_PROGRESS".equals(existing.get().getStatus()))
         * {
         * return existing.get();
         * }
         */

        com.multi.tenant.assessment.domain.TestAttempt attempt = new com.multi.tenant.assessment.domain.TestAttempt();
        attempt.setAssessmentId(testId);
        attempt.setLearnerUsername(username);
        attempt.setTenantId(tenantId);
        attempt.setStartTime(java.time.LocalDateTime.now());
        attempt.setStatus("IN_PROGRESS");

        return testAttemptRepository.save(attempt);
    }

    @GetMapping("/attempts/{attemptId}")
    public Map<String, Object> getAttempt(@PathVariable Long attemptId) {
        Long tenantId = TenantContext.getTenantId();
        com.multi.tenant.assessment.domain.TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .filter(a -> a.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        Assessment assessment = assessmentRepository.findById(attempt.getAssessmentId()).orElseThrow();

        // In real app, hide correct answers from questionsJson
        return Map.of("attempt", attempt, "assessment", assessment);
    }

    @PostMapping("/attempts/{attemptId}/submit")
    public com.multi.tenant.assessment.domain.TestAttempt submitAttempt(
            @PathVariable Long attemptId,
            @RequestBody Map<String, Object> body) {
        Long tenantId = TenantContext.getTenantId();
        com.multi.tenant.assessment.domain.TestAttempt attempt = testAttemptRepository.findById(attemptId)
                .filter(a -> a.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        attempt.setEndTime(java.time.LocalDateTime.now());
        attempt.setStatus("COMPLETED");
        attempt.setAnswersJson((String) body.getOrDefault("answersJson", "{}"));

        // Mock scoring: Random score for demo
        attempt.setScore((int) (Math.random() * 100));

        return testAttemptRepository.save(attempt);
    }
}
