package com.multi.tenant.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendInvitationEmail(String toEmail, String invitationLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@lms-platform.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to LMS Platinum - Set Your Password");
        message.setText("You have been invited to join the LMS Platform as a Tenant Administrator.\n\n" +
                "Please click the link below to set your password and activate your account:\n" +
                invitationLink + "\n\n" +
                "If you did not request this, please ignore this email.");

        try {
            mailSender.send(message);
            System.out.println("Invitation email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
            // In a real production system, you might want to re-throw or log to a
            // dead-letter queue
        }
    }
}
