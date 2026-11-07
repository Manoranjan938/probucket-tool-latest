package com.tool.ProjectTool.messaging;

/** An image file to delete from disk, by its stored name, once its attachment or project is gone */
public record FileCleanupMessage(String storedName) {
}
