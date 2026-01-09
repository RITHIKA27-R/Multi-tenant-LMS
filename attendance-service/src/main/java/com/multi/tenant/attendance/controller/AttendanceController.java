package com.multi.tenant.attendance.controller;

import com.multi.tenant.attendance.domain.Attendance;
import com.multi.tenant.attendance.repo.AttendanceRepository;
import com.multi.tenant.attendance.filter.TenantContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @PostMapping("/mark-in")
    public Attendance markIn(@RequestBody Map<String, String> data) {
        String employeeId = data.get("username");
        Long tenantId = TenantContext.getTenantId();
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDateAndTenantId(employeeId, today, tenantId)
                .orElse(new Attendance());

        attendance.setEmployeeId(employeeId);
        attendance.setTenantId(tenantId);
        attendance.setDate(today);
        attendance.setClockIn(LocalDateTime.now());

        return attendanceRepository.save(attendance);
    }

    @PostMapping("/mark-out")
    public Attendance markOut(@RequestBody Map<String, String> data) {
        String employeeId = data.get("username");
        Long tenantId = TenantContext.getTenantId();
        String today = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDateAndTenantId(employeeId, today, tenantId)
                .orElseThrow(() -> new RuntimeException("No clock-in found for today"));

        attendance.setClockOut(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    @GetMapping("/history")
    public List<Attendance> getHistory(@RequestParam("username") String username) {
        return attendanceRepository.findAllByEmployeeIdAndTenantId(username, TenantContext.getTenantId());
    }

    @GetMapping("/all")
    public List<Attendance> getAll() {
        return attendanceRepository.findAllByTenantId(TenantContext.getTenantId());
    }
}
