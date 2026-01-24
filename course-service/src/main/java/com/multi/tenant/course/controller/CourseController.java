package com.multi.tenant.course.controller;

import com.multi.tenant.course.context.TenantContext;
import com.multi.tenant.course.domain.Course;
import com.multi.tenant.course.repo.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/courses")
@SuppressWarnings("null")
public class CourseController {

    @Autowired
    private CourseRepository courseRepository;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "service", "course-service",
                "tenantId", TenantContext.getTenantId() != null ? TenantContext.getTenantId() : "NONE");
    }

    @GetMapping
    public @org.springframework.lang.NonNull List<Course> getCourses() {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new RuntimeException("Tenant ID not found in context");
        }
        return courseRepository.findAllByTenantId(tenantId);
    }

    @GetMapping("/{id}")
    public @org.springframework.lang.NonNull Course getCourseById(
            @PathVariable("id") @org.springframework.lang.NonNull Long id) {
        Long tenantId = TenantContext.getTenantId();
        return courseRepository.findById(id)
                .filter(course -> course.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Course not found or access denied"));
    }

    @PostMapping
    public @org.springframework.lang.NonNull Course createCourse(
            @RequestBody @org.springframework.lang.NonNull Course course) {
        Long tenantId = TenantContext.getTenantId();
        if (tenantId == null) {
            throw new RuntimeException("Tenant ID not found in context");
        }
        course.setTenantId(tenantId);
        return courseRepository.save(course);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable("id") @org.springframework.lang.NonNull Long id) {
        Long tenantId = TenantContext.getTenantId();
        Course course = courseRepository.findById(id)
                .filter(c -> c.getTenantId().equals(tenantId))
                .orElseThrow(() -> new RuntimeException("Course not found or access denied"));
        courseRepository.delete(course);
    }
}
