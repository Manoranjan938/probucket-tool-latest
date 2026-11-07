package com.tool.ProjectTool.messaging;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import java.util.Map;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.AmqpConnectException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

class JobPublisherTest {

	private RabbitTemplate rabbit;
	private JobPublisher publisher;
	private final EmailMessage message = new EmailMessage(EmailType.VERIFY_ACCOUNT, "a@b.test", Map.of("token", "t"));

	@BeforeEach
	void setUp() {
		rabbit = mock(RabbitTemplate.class);
		publisher = new JobPublisher(rabbit);
	}

	@AfterEach
	void clearTransaction() {
		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.clearSynchronization();
		}
	}

	@Test
	void outsideATransactionItIsQueuedAtOnce() {
		publisher.publish(MessagingConfig.EMAIL_ROUTING_KEY, message);

		verify(rabbit).convertAndSend(MessagingConfig.EXCHANGE, MessagingConfig.EMAIL_ROUTING_KEY, message);
	}

	@Test
	void insideATransactionItWaitsForTheCommit() {
		TransactionSynchronizationManager.initSynchronization();

		publisher.publish(MessagingConfig.EMAIL_ROUTING_KEY, message);
		verify(rabbit, never()).convertAndSend(anyString(), anyString(), any(Object.class));

		TransactionSynchronizationManager.getSynchronizations().forEach(TransactionSynchronization::afterCommit);
		verify(rabbit).convertAndSend(eq(MessagingConfig.EXCHANGE), eq(MessagingConfig.EMAIL_ROUTING_KEY), eq(message));
	}

	@Test
	void aRolledBackTransactionQueuesNothing() {
		TransactionSynchronizationManager.initSynchronization();

		publisher.publish(MessagingConfig.EMAIL_ROUTING_KEY, message);
		TransactionSynchronizationManager.getSynchronizations()
				.forEach(s -> s.afterCompletion(TransactionSynchronization.STATUS_ROLLED_BACK));

		verify(rabbit, never()).convertAndSend(anyString(), anyString(), any(Object.class));
	}

	// The request's own work is already saved, so it doesn't turn into an error for the user
	@Test
	void whenRabbitMqCantBeReachedItIsLoggedNotThrown() {
		doThrow(new AmqpConnectException(new java.net.ConnectException("refused"))).when(rabbit)
				.convertAndSend(anyString(), anyString(), any(Object.class));

		assertThatCode(() -> publisher.publish(MessagingConfig.EMAIL_ROUTING_KEY, message)).doesNotThrowAnyException();
	}
}
