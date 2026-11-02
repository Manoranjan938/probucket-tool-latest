package com.tool.ProjectTool.controller;

import org.springframework.boot.webmvc.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

// Replaces Spring Boot's /error JSON, used for uncaught exceptions and 403s from Spring Security
@RestController
public class ApiErrorController implements ErrorController {

	@RequestMapping("/error")
	public ResponseEntity<ApiResponse<Void>> handleError(HttpServletRequest request) {

		Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);

		return ApiResponseBuilder
				.error(status instanceof Integer code ? HttpStatusCode.valueOf(code) : HttpStatus.INTERNAL_SERVER_ERROR);
	}

}
