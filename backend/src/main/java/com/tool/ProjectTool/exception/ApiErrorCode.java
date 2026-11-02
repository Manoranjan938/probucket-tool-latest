package com.tool.ProjectTool.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

public enum ApiErrorCode {

	VALIDATION_FAILED(HttpStatus.BAD_REQUEST),
	BAD_REQUEST(HttpStatus.BAD_REQUEST),
	USER_ALREADY_EXISTS(HttpStatus.BAD_REQUEST),
	USER_NOT_FOUND(HttpStatus.BAD_REQUEST),
	PROJECT_NOT_FOUND(HttpStatus.BAD_REQUEST),
	TASK_NOT_FOUND(HttpStatus.BAD_REQUEST),
	DATA_NOT_FOUND(HttpStatus.BAD_REQUEST),
	INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED),
	UNAUTHORIZED(HttpStatus.UNAUTHORIZED),
	FORBIDDEN(HttpStatus.FORBIDDEN),
	NOT_FOUND(HttpStatus.NOT_FOUND),
	METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED),
	UNSUPPORTED_MEDIA_TYPE(HttpStatus.UNSUPPORTED_MEDIA_TYPE),
	INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR);

	private final HttpStatus status;

	ApiErrorCode(HttpStatus status) {
		this.status = status;
	}

	public HttpStatus getStatus() {
		return status;
	}

	// For errors raised by the framework, where only the HTTP status is known
	public static ApiErrorCode fromStatus(HttpStatusCode status) {
		if (status.is5xxServerError()) {
			return INTERNAL_ERROR;
		}

		switch (status.value()) {
		case 401:
			return UNAUTHORIZED;
		case 403:
			return FORBIDDEN;
		case 404:
			return NOT_FOUND;
		case 405:
			return METHOD_NOT_ALLOWED;
		case 415:
			return UNSUPPORTED_MEDIA_TYPE;
		default:
			return BAD_REQUEST;
		}
	}

}
