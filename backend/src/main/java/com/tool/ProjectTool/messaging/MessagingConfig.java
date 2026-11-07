package com.tool.ProjectTool.messaging;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.rabbit.connection.Connection;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.rabbit.retry.MessageRecoverer;
import org.springframework.amqp.rabbit.retry.RepublishMessageRecoverer;
import org.springframework.amqp.support.converter.JacksonJsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.SmartInitializingSingleton;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// RabbitMQ layout: work is published to one direct exchange, one queue per kind of job.
// A message that still fails after the retries in application.properties goes to that queue's
// dead-letter queue (<queue>.dlq), with the error in its headers, so it can be looked at and
// moved back from the RabbitMQ admin page.
@Configuration
public class MessagingConfig {

	public static final String EXCHANGE = "probucket.jobs";
	public static final String DEAD_LETTER_EXCHANGE = "probucket.dlx";

	public static final String EMAIL_ROUTING_KEY = "email";
	public static final String EMAIL_QUEUE = "probucket.email";

	@Bean
	DirectExchange jobsExchange() {
		return new DirectExchange(EXCHANGE);
	}

	@Bean
	DirectExchange deadLetterExchange() {
		return new DirectExchange(DEAD_LETTER_EXCHANGE);
	}

	@Bean
	Queue emailQueue() {
		return workQueue(EMAIL_QUEUE, EMAIL_ROUTING_KEY);
	}

	@Bean
	Queue emailDeadLetterQueue() {
		return QueueBuilder.durable(EMAIL_QUEUE + ".dlq").build();
	}

	@Bean
	Binding emailBinding() {
		return BindingBuilder.bind(emailQueue()).to(jobsExchange()).with(EMAIL_ROUTING_KEY);
	}

	@Bean
	Binding emailDeadLetterBinding() {
		return BindingBuilder.bind(emailDeadLetterQueue()).to(deadLetterExchange()).with(EMAIL_ROUTING_KEY);
	}

	// Messages are JSON; only our own message classes may be read back from them
	@Bean
	MessageConverter messageConverter() {
		return new JacksonJsonMessageConverter(MessagingConfig.class.getPackageName());
	}

	// Once the retries are used up, the message goes to the dead-letter exchange under its own routing key,
	// with the exception message and stack trace added as headers
	@Bean
	MessageRecoverer messageRecoverer(RabbitTemplate rabbitTemplate) {
		RepublishMessageRecoverer recoverer = new RepublishMessageRecoverer(rabbitTemplate, DEAD_LETTER_EXCHANGE);
		recoverer.setErrorRoutingKeyPrefix("");
		return recoverer;
	}

	// RabbitMQ is required: without it the app doesn't start, instead of quietly losing emails and jobs.
	// Runs before the web server and the listeners start.
	@Bean
	SmartInitializingSingleton requireRabbitMq(ConnectionFactory connectionFactory) {
		return () -> {
			try (Connection connection = connectionFactory.createConnection()) {
				// Opening it is the check
			}
		};
	}

	// Durable, and anything rejected without a retry (e.g. a message that can't be read) also goes to the dead-letter queue
	private static Queue workQueue(String name, String routingKey) {
		return QueueBuilder.durable(name)
				.deadLetterExchange(DEAD_LETTER_EXCHANGE)
				.deadLetterRoutingKey(routingKey)
				.build();
	}
}
