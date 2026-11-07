package com.tool.ProjectTool.messaging;

import java.util.ArrayList;
import java.util.List;

import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Declarable;
import org.springframework.amqp.core.Declarables;
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

// RabbitMQ layout: work is published to one direct exchange, one queue per kind of job, and the routing key
// is the job's name. A message that still fails after the retries in application.properties goes to that
// queue's dead-letter queue (<queue>.dlq), with the error in its headers, so it can be looked at and
// moved back from the RabbitMQ admin page.
@Configuration
public class MessagingConfig {

	public static final String EXCHANGE = "probucket.jobs";
	public static final String DEAD_LETTER_EXCHANGE = "probucket.dlx";

	public static final String EMAIL_ROUTING_KEY = "email";
	public static final String EMAIL_QUEUE = "probucket.email";

	public static final String PROJECT_PURGE_ROUTING_KEY = "project-purge";
	public static final String PROJECT_PURGE_QUEUE = "probucket.project-purge";

	public static final String ACTIVITY_ROUTING_KEY = "activity";
	public static final String ACTIVITY_QUEUE = "probucket.activity";

	public static final String FILE_CLEANUP_ROUTING_KEY = "file-cleanup";
	public static final String FILE_CLEANUP_QUEUE = "probucket.file-cleanup";

	@Bean
	DirectExchange jobsExchange() {
		return new DirectExchange(EXCHANGE);
	}

	@Bean
	DirectExchange deadLetterExchange() {
		return new DirectExchange(DEAD_LETTER_EXCHANGE);
	}

	// Each job's queue and its dead-letter queue, with their bindings
	@Bean
	Declarables jobQueues(DirectExchange jobsExchange, DirectExchange deadLetterExchange) {
		List<Declarable> declarables = new ArrayList<>();
		addJob(declarables, jobsExchange, deadLetterExchange, EMAIL_QUEUE, EMAIL_ROUTING_KEY);
		addJob(declarables, jobsExchange, deadLetterExchange, PROJECT_PURGE_QUEUE, PROJECT_PURGE_ROUTING_KEY);
		addJob(declarables, jobsExchange, deadLetterExchange, ACTIVITY_QUEUE, ACTIVITY_ROUTING_KEY);
		addJob(declarables, jobsExchange, deadLetterExchange, FILE_CLEANUP_QUEUE, FILE_CLEANUP_ROUTING_KEY);
		return new Declarables(declarables);
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
	private static void addJob(List<Declarable> declarables, DirectExchange jobs, DirectExchange deadLetters,
			String queueName, String routingKey) {
		Queue queue = QueueBuilder.durable(queueName)
				.deadLetterExchange(DEAD_LETTER_EXCHANGE)
				.deadLetterRoutingKey(routingKey)
				.build();
		Queue deadLetterQueue = QueueBuilder.durable(queueName + ".dlq").build();

		declarables.add(queue);
		declarables.add(deadLetterQueue);
		declarables.add(BindingBuilder.bind(queue).to(jobs).with(routingKey));
		declarables.add(BindingBuilder.bind(deadLetterQueue).to(deadLetters).with(routingKey));
	}
}
