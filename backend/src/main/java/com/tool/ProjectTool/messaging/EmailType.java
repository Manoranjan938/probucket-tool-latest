package com.tool.ProjectTool.messaging;

import java.util.Map;

/** The emails the app sends, each with its template in resources/templates */
public enum EmailType {

	VERIFY_ACCOUNT("registration-confirmation-template.ftl") {
		@Override
		public String subject(Map<String, String> data) {
			return "Verify email request";
		}
	},

	PASSWORD_RESET("password-change-template.ftl") {
		@Override
		public String subject(Map<String, String> data) {
			return "Complete your password reset request";
		}
	},

	TEAM_INVITE("new-team-member-template.ftl") {
		@Override
		public String subject(Map<String, String> data) {
			return "You've been added to " + data.get("projectName") + " on ProBucket";
		}
	};

	private final String template;

	EmailType(String template) {
		this.template = template;
	}

	public String template() {
		return template;
	}

	public abstract String subject(Map<String, String> data);
}
