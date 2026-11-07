package com.tool.ProjectTool.messaging;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Instant;
import java.util.Map;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageProperties;
import org.springframework.amqp.support.converter.MessageConverter;

import com.tool.ProjectTool.entity.ActivityType;

// Every job message survives the trip through RabbitMQ as JSON unchanged
class MessageConverterTest {

	private final MessageConverter converter = new MessagingConfig().messageConverter();

	static Object[] messages() {
		return new Object[] {
				new EmailMessage(EmailType.TEAM_INVITE, "a@b.test", Map.of("token", "t", "projectName", "Apollo")),
				new ProjectPurgeMessage("p1"),
				new FileCleanupMessage("abc.png"),
				new ActivityMessage(ActivityType.STATUS_CHANGED, "AB", "AB-1", "Ship it", "TODO", "COMPLETED", "user-1",
						"Asha", Instant.parse("2026-11-07T10:15:30.123Z")),
				new ActivityMessage(ActivityType.MEMBER_ADDED, "AB", null, null, null, "Ravi", null, null,
						Instant.parse("2026-11-07T10:15:30Z")) };
	}

	@ParameterizedTest
	@MethodSource("messages")
	void readsBackWhatWasSent(Object sent) {
		Message message = converter.toMessage(sent, new MessageProperties());

		assertThat(converter.fromMessage(message)).isEqualTo(sent);
	}
}
