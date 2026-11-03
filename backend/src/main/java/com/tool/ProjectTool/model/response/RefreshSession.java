package com.tool.ProjectTool.model.response;

// refreshToken is null when the browser already holds the newest one (see RefreshTokenService.rotate)
public record RefreshSession(String userId, String sessionId, String refreshToken) {

}
