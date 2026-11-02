package com.tool.ProjectTool.model.response;

import java.util.Map;

import com.tool.ProjectTool.exception.ApiErrorCode;

// The structure of every API response. Built by ApiResponseBuilder.
public class ApiResponse<T> {

	private final boolean success;

	private final int status;

	private final ApiErrorCode code;

	private final String message;

	private final T data;

	private final Map<String, String> errors;

	ApiResponse(boolean success, int status, ApiErrorCode code, String message, T data, Map<String, String> errors) {
		this.success = success;
		this.status = status;
		this.code = code;
		this.message = message;
		this.data = data;
		this.errors = errors;
	}

	public boolean isSuccess() {
		return success;
	}

	public int getStatus() {
		return status;
	}

	public ApiErrorCode getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}

	public T getData() {
		return data;
	}

	public Map<String, String> getErrors() {
		return errors;
	}

}
