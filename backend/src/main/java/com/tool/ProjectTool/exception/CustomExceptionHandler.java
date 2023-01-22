package com.tool.ProjectTool.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@RestController
public class CustomExceptionHandler extends ResponseEntityExceptionHandler {

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
