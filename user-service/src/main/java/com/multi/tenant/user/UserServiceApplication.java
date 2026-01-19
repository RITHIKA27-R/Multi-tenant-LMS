package com.multi.tenant.user;

import com.multi.tenant.user.domain.Tenant;
import com.multi.tenant.user.domain.User;
import com.multi.tenant.user.repo.TenantRepository;
import com.multi.tenant.user.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }

    @Bean
    public CommandLineRunner dataLoader(TenantRepository tenantRepository, UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                System.out.println("Starting data seeding...");

                // 1. Seed Tenants SAFELY
                Tenant t1 = tenantRepository.findByIdentifier("acme");
                if (t1 == null) {
                    System.out.println("Seeding Acme tenant...");
                    t1 = new Tenant();
                    t1.setName("Acme Corp");
                    t1.setIdentifier("acme");
                    t1 = tenantRepository.save(t1);
                    System.out.println("Acme tenant seeded with ID: " + t1.getId());
                }

                Tenant t2 = tenantRepository.findByIdentifier("beta");
                if (t2 == null) {
                    System.out.println("Seeding Beta tenant...");
                    t2 = new Tenant();
                    t2.setName("Beta Updates");
                    t2.setIdentifier("beta");
                    t2 = tenantRepository.save(t2);
                    System.out.println("Beta tenant seeded with ID: " + t2.getId());
                }

                // 2. Seed Users SAFELY
                seedUserIfMissing(userRepository, passwordEncoder, "superadmin", "superadmin@lms.com",
                        "superpassword", "SUPER_ADMIN", null);

                if (t1 != null) {
                    seedUserIfMissing(userRepository, passwordEncoder, "tenant", "tenant@gmail.com", "password",
                            "TENANT_ADMIN", t1.getId());
                }

                if (t2 != null) {
                    seedUserIfMissing(userRepository, passwordEncoder, "learner", "learner@lms.com", "password",
                            "LEARNER", t2.getId());
                }

                System.out.println("Data seeding completed successfully.");
            } catch (Exception e) {
                System.err.println("CRITICAL ERROR during data seeding: " + e.getMessage());
                e.printStackTrace();
            }
        };
    }

    private void seedUserIfMissing(UserRepository userRepository, PasswordEncoder passwordEncoder,
            String username, String email, String password, String role, Long tenantId) {
        if (userRepository.findByEmail(email).isEmpty() && userRepository.findByUsername(username).isEmpty()) {
            System.out.println("Seeding user: " + email + " (Username: " + username + ")");
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setTenantId(tenantId);
            user.setStatus("ACTIVE");
            userRepository.save(user);
            System.out.println("User seeded successfully: " + email);
        } else {
            System.out.println("User already exists, skipping: " + email);
        }
    }
}
