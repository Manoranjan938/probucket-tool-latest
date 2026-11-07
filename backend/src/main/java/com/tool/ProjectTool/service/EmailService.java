package com.tool.ProjectTool.service;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.tool.ProjectTool.messaging.EmailMessage;
import com.tool.ProjectTool.messaging.EmailType;
import com.tool.ProjectTool.messaging.JobPublisher;
import com.tool.ProjectTool.messaging.MessagingConfig;

// Queues the app's emails; EmailListener sends them, so no request waits for the mail server
@Service
public class EmailService {

	private final JobPublisher publisher;

	public EmailService(JobPublisher publisher) {
		this.publisher = publisher;
	}

	public void sendVerifyAccount(String to, String token) {
		queue(EmailType.VERIFY_ACCOUNT, to, Map.of("token", token));
	}

	public void sendPasswordReset(String to, String token) {
		queue(EmailType.PASSWORD_RESET, to, Map.of("token", token));
	}

	public void sendTeamInvite(String to, String token, String inviterName, String projectName) {
		queue(EmailType.TEAM_INVITE, to,
				Map.of("token", token, "inviterName", inviterName, "projectName", projectName));
	}

	private void queue(EmailType type, String to, Map<String, String> data) {
		publisher.publish(MessagingConfig.EMAIL_ROUTING_KEY, new EmailMessage(type, to, data));
	}
}
