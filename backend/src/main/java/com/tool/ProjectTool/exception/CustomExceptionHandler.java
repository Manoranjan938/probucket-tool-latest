package com.tool.ProjectTool.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.tool.ProjectTool.model.response.ApiResponse;
import com.tool.ProjectTool.model.response.ApiResponseBuilder;

@ControllerAdvice
@RestController
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

	// Errors raised by Spring MVC (malformed JSON, wrong method, unknown URL...) use the same structure
	@Override
	protected ResponseEntity<Object> createResponseEntity(Object body, HttpHeaders headers, HttpStatusCode statusCode,
			WebRequest request) {
		return new ResponseEntity<Object>(ApiResponseBuilder.error(statusCode).getBody(), headers, statusCode);
	}

	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleBadRequestException(BadRequestException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.BAD_REQUEST, ex.getMessage());
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleUserExistException(UserAlreadyExistException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.USER_ALREADY_EXISTS, ex.getMessage());
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleUserNotFoundException(UserNotFoundException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.USER_NOT_FOUND, ex.getMessage());
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleProjectNotFoundException(ProjectNotFoundException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.PROJECT_NOT_FOUND, ex.getMessage());
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleTaskNotFoundException(TaskIdNotFoundException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.TASK_NOT_FOUND, ex.getMessage());
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<ApiResponse<Void>> handleDataNotFoundException(DataNotFoundException ex, WebRequest request){
		
		return ApiResponseBuilder.error(ApiErrorCode.DATA_NOT_FOUND, ex.getMessage());
		
	}
}
