package com.tool.ProjectTool.model.response;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;

import com.tool.ProjectTool.exception.ApiErrorCode;

public final class ApiResponseBuilder {

	private static final String DEFAULT_MESSAGE = "Success";

	private ApiResponseBuilder() {
	}

	public static <T> ResponseEntity<ApiResponse<T>> ok(T data) {
		return success(HttpStatus.OK, DEFAULT_MESSAGE, data);
	}

	public static <T> ResponseEntity<ApiResponse<T>> ok(String message, T data) {
		return success(HttpStatus.OK, message, data);
	}

	public static ResponseEntity<ApiResponse<Void>> ok(String message) {
		return success(HttpStatus.OK, message, null);
	}

	public static <T> ResponseEntity<ApiResponse<T>> created(String message, T data) {
		return success(HttpStatus.CREATED, message, data);
	}

	public static ResponseEntity<ApiResponse<Void>> created(String message) {
		return success(HttpStatus.CREATED, message, null);
	}

	public static ResponseEntity<ApiResponse<Void>> error(ApiErrorCode code, String message) {
		return error(code, message, null);
	}

	public static ResponseEntity<ApiResponse<Void>> error(ApiErrorCode code, String message,
			Map<String, String> errors) {
		return build(false, code.getStatus(), code, message, null, errors);
	}

	// For errors raised by the framework, where only the HTTP status is known
	public static ResponseEntity<ApiResponse<Void>> error(HttpStatusCode status) {
		HttpStatus known = HttpStatus.resolve(status.value());

		return build(false, status, ApiErrorCode.fromStatus(status), known != null ? known.getReasonPhrase() : "Error",
				null, null);
	}

	private static <T> ResponseEntity<ApiResponse<T>> success(HttpStatus status, String message, T data) {
		return build(true, status, null, message, data, null);
	}

	private static <T> ResponseEntity<ApiResponse<T>> build(boolean success, HttpStatusCode status, ApiErrorCode code,
			String message, T data, Map<String, String> errors) {
		return ResponseEntity.status(status)
				.body(new ApiResponse<T>(success, status.value(), code, message, data, errors));
	}

}
