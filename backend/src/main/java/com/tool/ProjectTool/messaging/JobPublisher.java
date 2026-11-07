package com.tool.ProjectTool.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

// Puts a job on the queue. Inside a transaction it waits until the transaction has committed,
// so a job never refers to data that was rolled back.
@Component
public class JobPublisher {

	private static final Logger log = LoggerFactory.getLogger(JobPublisher.class);

	private final RabbitTemplate rabbitTemplate;

	public JobPublisher(RabbitTemplate rabbitTemplate) {
		this.rabbitTemplate = rabbitTemplate;
	}

	/**
	 * A failure to queue is logged, not thrown: the request's own work is already saved by then,
	 * and the caller would otherwise report an error for something that did happen.
	 */
	public void publish(String routingKey, Object message) {
		Runnable send = () -> {
			try {
				rabbitTemplate.convertAndSend(MessagingConfig.EXCHANGE, routingKey, message);
			} catch (AmqpException e) {
				log.error("Couldn't queue a '{}' job", routingKey, e);
			}
		};

		if (TransactionSynchronizationManager.isSynchronizationActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					send.run();
				}
			});
		} else {
			send.run();
		}
	}
}
