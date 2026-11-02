package com.tool.ProjectTool.model.response;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.tool.ProjectTool.exception.ApiErrorCode;

class ApiResponseBuilderTest {

	@Test
	void okWithDataUsesDefaultMessage() {
		ResponseEntity<ApiResponse<List<String>>> response = ApiResponseBuilder.ok(List.of("a"));

		assertEquals(HttpStatus.OK, response.getStatusCode());
		assertTrue(response.getBody().isSuccess());
		assertEquals(200, response.getBody().getStatus());
		assertNull(response.getBody().getCode());
		assertEquals("Success", response.getBody().getMessage());
		assertEquals(List.of("a"), response.getBody().getData());
		assertNull(response.getBody().getErrors());
	}

	@Test
	void stringArgumentIsTheMessageNotTheData() {
		ApiResponse<Void> ok = ApiResponseBuilder.ok("Saved").getBody();
		ApiResponse<Void> created = ApiResponseBuilder.created("Added").getBody();

		assertEquals("Saved", ok.getMessage());
		assertNull(ok.getData());
		assertEquals(201, created.getStatus());
		assertEquals("Added", created.getMessage());
	}

	@Test
	void errorTakesStatusFromCode() {
		ResponseEntity<ApiResponse<Void>> response = ApiResponseBuilder.error(ApiErrorCode.VALIDATION_FAILED,
				"Validation failed", Map.of("name", "required"));

		assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
		assertFalse(response.getBody().isSuccess());
		assertEquals(400, response.getBody().getStatus());
		assertEquals(ApiErrorCode.VALIDATION_FAILED, response.getBody().getCode());
		assertEquals(Map.of("name", "required"), response.getBody().getErrors());
		assertNull(response.getBody().getData());
	}

	@Test
	void frameworkErrorDerivesCodeAndMessageFromStatus() {
		ApiResponse<Void> notFound = ApiResponseBuilder.error(HttpStatus.NOT_FOUND).getBody();
		ApiResponse<Void> gateway = ApiResponseBuilder.error(HttpStatus.BAD_GATEWAY).getBody();

		assertEquals(ApiErrorCode.NOT_FOUND, notFound.getCode());
		assertEquals("Not Found", notFound.getMessage());
		assertEquals(ApiErrorCode.INTERNAL_ERROR, gateway.getCode());
		assertEquals(502, gateway.getStatus());
	}

}
