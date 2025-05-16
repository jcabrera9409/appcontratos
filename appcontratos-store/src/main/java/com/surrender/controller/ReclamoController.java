package com.surrender.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.dto.APIResponseDTO;
import com.surrender.model.Reclamo;
import com.surrender.service.impl.ReclamoServiceImpl;

@RestController
@RequestMapping("/reclamo")
public class ReclamoController {

	@Autowired
	private ReclamoServiceImpl service;
	
	@PostMapping
	public ResponseEntity<?> guardarReclamo(@RequestBody Reclamo reclamo) {
		APIResponseDTO<Reclamo> respuesta = service.registrarReclamo(reclamo);
		if(!respuesta.isSuccess()) {
			respuesta.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<APIResponseDTO<Reclamo>>(respuesta, HttpStatus.BAD_REQUEST);
		}
		respuesta.setStatusCode(HttpStatus.OK.value());
		return new ResponseEntity<APIResponseDTO<Reclamo>>(respuesta, HttpStatus.OK);
	}
}
