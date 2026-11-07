package com.tool.ProjectTool.service;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

// Keeps attachment files in one folder (a Docker volume in production). Names are always our own random ones.
@Component
public class AttachmentStorage {

	private final Path root;

	public AttachmentStorage(@Value("${app.attachments.dir}") String dir) {
		this.root = Paths.get(dir).toAbsolutePath().normalize();
	}

	public void save(String storedName, byte[] content) {
		try {
			Files.createDirectories(root);
			Files.write(resolve(storedName), content);
		} catch (IOException e) {
			throw new UncheckedIOException("Couldn't store the attachment", e);
		}
	}

	public Resource load(String storedName) {
		return new FileSystemResource(resolve(storedName));
	}

	/** A file that is already gone counts as deleted, so this is safe to repeat (the file clean-up queue retries it) */
	public void delete(String storedName) {
		try {
			Files.deleteIfExists(resolve(storedName));
		} catch (IOException e) {
			throw new UncheckedIOException("Couldn't delete the attachment file " + storedName, e);
		}
	}

	private Path resolve(String storedName) {
		Path path = root.resolve(storedName).normalize();
		if (!path.getParent().equals(root)) {
			throw new IllegalArgumentException("Invalid attachment name");
		}
		return path;
	}
}
