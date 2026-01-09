package com.multi.tenant.notification.repo;

import com.multi.tenant.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByTenantId(Long tenantId);
}
