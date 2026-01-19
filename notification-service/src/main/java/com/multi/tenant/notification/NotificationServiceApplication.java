package com.multi.tenant.notification;

import com.multi.tenant.notification.domain.Notification;
import com.multi.tenant.notification.repo.NotificationRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class NotificationServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner seedNotifications(NotificationRepository repo) {
        return args -> {
            if (repo.count() == 0) {
                repo.save(new Notification(null, "Welcome to the Multi-Tenant LMS!", "alice@acme.com", 1L, false));
                repo.save(new Notification(null, "Your new course 'Spring Boot' is available.", "alice@acme.com", 1L,
                        false));
                repo.save(new Notification(null, "New assessment 'Introduction' created.", "bob@beta.com", 2L, false));
            }
        };
    }
}
