package com.example.demo.controller.advice;

   import java.util.HashMap;
   import java.util.Map;

   import org.springframework.http.HttpStatus;
   import org.springframework.http.ResponseEntity;
   import org.springframework.web.bind.MethodArgumentNotValidException;
   import org.springframework.web.bind.annotation.ControllerAdvice;
   import org.springframework.web.bind.annotation.ExceptionHandler;
   import org.springframework.web.bind.annotation.ResponseStatus;

   @ControllerAdvice
   public class GlobalExceptionHandler {
       @ExceptionHandler(MethodArgumentNotValidException.class)
       @ResponseStatus(HttpStatus.BAD_REQUEST)
       public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
           Map<String, String> errors = new HashMap<>();
           ex.getBindingResult().getFieldErrors().forEach(error ->
               errors.put(error.getField(), error.getDefaultMessage())
           );
           return ResponseEntity.badRequest().body(errors);
       }

       @ExceptionHandler(IllegalArgumentException.class)
       @ResponseStatus(HttpStatus.BAD_REQUEST)
       public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException ex) {
           return ResponseEntity.badRequest().body(ex.getMessage());
       }

       @ExceptionHandler(Exception.class)
       @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
       public ResponseEntity<String> handleAllExceptions(Exception ex) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + ex.getMessage());
       }
   }