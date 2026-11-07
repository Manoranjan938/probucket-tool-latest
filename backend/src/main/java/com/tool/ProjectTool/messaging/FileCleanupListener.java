package com.tool.ProjectTool.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import com.tool.ProjectTool.service.AttachmentStorage;

// Deletes image files whose attachment or project has been removed. A disk error is thrown, so it is retried.
@Component
public class FileCleanupListener {

	private final AttachmentStorage storage;

	public FileCleanupListener(AttachmentStorage storage) {
		this.storage = storage;
	}

	@RabbitListener(queues = MessagingConfig.FILE_CLEANUP_QUEUE)
	public void delete(FileCleanupMessage message) {
		storage.delete(message.storedName());
	}
}
