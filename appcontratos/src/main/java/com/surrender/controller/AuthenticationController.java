package com.surrender.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Vendedor;
import com.surrender.service.impl.AuthenticationService;
import com.surrender.util.EmailUtil;
import com.surrender.util.Mail;

import dto.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/auth")
public class AuthenticationController {

	@Autowired
	private AuthenticationService authService;
	
	@Autowired
	private EmailUtil emailUtil;
	
	@PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody Vendedor request
            ) {
		return new ResponseEntity<AuthenticationResponse>(authService.register(request), HttpStatus.OK);
    }
	
	@PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody Vendedor request
    ) {
		return new ResponseEntity<AuthenticationResponse>(authService.authenticate(request), HttpStatus.OK);
    }
	
	@PostMapping("/refresh_token")
    public ResponseEntity refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        return authService.refreshToken(request, response);
    }
	
}
