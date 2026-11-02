package com.tool.ProjectTool.exception;

import java.io.IOException;
import java.io.UncheckedIOException;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice
@RestController
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

	// Spring MVC exceptions (malformed JSON, wrong method...) keep their empty body instead of the default problem+json.
	@Override
	protected ResponseEntity<Object> createResponseEntity(Object body, HttpHeaders headers, HttpStatusCode statusCode,
			WebRequest request) {
		return new ResponseEntity<Object>(null, headers, statusCode);
	}

	// Unknown URLs keep getting Spring Boot's /error JSON response.
	@Override
	protected ResponseEntity<Object> handleNoResourceFoundException(NoResourceFoundException ex, HttpHeaders headers,
			HttpStatusCode status, WebRequest request) {
		try {
			((ServletWebRequest) request).getResponse().sendError(status.value());
		} catch (IOException e) {
			throw new UncheckedIOException(e);
		}
		return null;
	}

	@ExceptionHandler
	public final ResponseEntity<Object> handleBadRequestException(BadRequestException ex, WebRequest request){
		
		BadRequestExceptionResponse exceptionResponse = new BadRequestExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<Object> handleUserExistException(UserAlreadyExistException ex, WebRequest request){
		
		UserAlreadyExistExceptionResponse exceptionResponse = new UserAlreadyExistExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<Object> handleUserNotFoundException(UserNotFoundException ex, WebRequest request){
		
		UserNotFoundExceptionResponse exceptionResponse = new UserNotFoundExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<Object> handleProjectNotFoundException(ProjectNotFoundException ex, WebRequest request){
		
		ProjectNotFoundExceptionResponse exceptionResponse = new ProjectNotFoundExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<Object> handleTaskNotFoundException(TaskIdNotFoundException ex, WebRequest request){
		
		TaskIdNotFoundExceptionResponse exceptionResponse = new TaskIdNotFoundExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
	
	@ExceptionHandler
	public final ResponseEntity<Object> handleDataNotFoundException(DataNotFoundException ex, WebRequest request){
		
		DataNotFoundExceptionResponse exceptionResponse = new DataNotFoundExceptionResponse(ex.getMessage());
		
		return new ResponseEntity<Object>(exceptionResponse, HttpStatus.BAD_REQUEST);
		
	}
}
