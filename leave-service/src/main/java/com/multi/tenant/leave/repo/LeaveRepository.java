package com.multi.tenant.leave.repo;

import com.multi.tenant.leave.domain.LeaveRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LeaveRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findAllByEmployeeIdAndTenantId(String employeeId, Long tenantId);
    List<LeaveRequest> findAllByTenantId(Long tenantId);
    List<LeaveRequest> findAllByTenantIdAndStatus(Long tenantId, String status);
}
