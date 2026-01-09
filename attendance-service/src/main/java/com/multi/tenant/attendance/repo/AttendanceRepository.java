package com.multi.tenant.attendance.repo;

import com.multi.tenant.attendance.domain.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findAllByEmployeeIdAndTenantId(String employeeId, Long tenantId);
    List<Attendance> findAllByTenantId(Long tenantId);
    Optional<Attendance> findByEmployeeIdAndDateAndTenantId(String employeeId, String date, Long tenantId);
}
