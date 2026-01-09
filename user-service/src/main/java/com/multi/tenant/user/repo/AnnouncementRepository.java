package com.multi.tenant.user.repo;

import com.multi.tenant.user.domain.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findAllByActiveTrue();
}
