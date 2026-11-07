package com.tool.ProjectTool.cache;

import com.tool.ProjectTool.entity.Users;

/**
 * What the app reads from the logged-in user, kept in Redis instead of the whole entity: no password hash and
 * no tokens. The Users rebuilt from it is only read (the login's principal), never saved.
 */
public record CachedUser(Long id, String userId, String username, String name, String email, String phone,
		String imageUrl, int status, String roleName) {

	public static CachedUser of(Users user) {
		return new CachedUser(user.getId(), user.getUserId(), user.getUsername(), user.getName(), user.getEmail(),
				user.getPhone(), user.getImageUrl(), user.getStatus(), user.getRoleName());
	}

	public Users toUser() {
		Users user = new Users();
		user.setId(id);
		user.setUserId(userId);
		user.setUsername(username);
		user.setName(name);
		user.setEmail(email);
		user.setPhone(phone);
		user.setImageUrl(imageUrl);
		user.setStatus(status);
		user.setRoleName(roleName);
		return user;
	}
}
