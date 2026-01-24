package com.multi.tenant.leave.controller;

import com.multi.tenant.leave.domain.LeaveRequest;
import com.multi.tenant.leave.repo.LeaveRepository;
import com.multi.tenant.leave.filter.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leaves")
@SuppressWarnings("null")
public class LeaveController {

    @Autowired
    private LeaveRepository leaveRepository;

    @PostMapping("/apply")
    public @org.springframework.lang.NonNull LeaveRequest apply(
            @RequestBody @org.springframework.lang.NonNull LeaveRequest request) {
        request.setTenantId(TenantContext.getTenantId());
        request.setStatus("PENDING");
        return leaveRepository.save(request);
    }

    @GetMapping("/my-requests")
    public @org.springframework.lang.NonNull List<LeaveRequest> getMyRequests(
            @RequestParam("username") @org.springframework.lang.NonNull String username) {
        return leaveRepository.findAllByEmployeeIdAndTenantId(username, TenantContext.getTenantId());
    }

    @GetMapping("/admin/pending")
    public List<LeaveRequest> getPending() {
        return leaveRepository.findAllByTenantIdAndStatus(TenantContext.getTenantId(), "PENDING");
    }

    @PutMapping("/admin/approve/{id}")
    public LeaveRequest approve(@PathVariable("id") Long id) {
        LeaveRequest req = leaveRepository.findById(id)
                .filter(r -> r.getTenantId().equals(TenantContext.getTenantId()))
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus("APPROVED");
        return leaveRepository.save(req);
    }

    @PutMapping("/admin/reject/{id}")
    public LeaveRequest reject(@PathVariable("id") Long id) {
        LeaveRequest req = leaveRepository.findById(id)
                .filter(r -> r.getTenantId().equals(TenantContext.getTenantId()))
                .orElseThrow(() -> new RuntimeException("Request not found"));
        req.setStatus("REJECTED");
        return leaveRepository.save(req);
    }
}
