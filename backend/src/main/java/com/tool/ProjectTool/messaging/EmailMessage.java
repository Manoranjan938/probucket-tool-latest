package com.tool.ProjectTool.messaging;

import java.util.Map;

/** One email waiting to be sent; data holds the values its template needs */
public record EmailMessage(EmailType type, String to, Map<String, String> data) {
}
