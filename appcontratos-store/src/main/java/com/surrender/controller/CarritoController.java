package com.surrender.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.dto.APIResponseDTO;
import com.surrender.dto.CarritoDTO;
import com.surrender.model.Contrato;
import com.surrender.service.impl.ContratoServiceImpl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/carrito")
public class CarritoController {

	@Autowired
	private ContratoServiceImpl service;

	@PostMapping
	public ResponseEntity<?> guardarCarrito(@RequestBody CarritoDTO carrito) {
		APIResponseDTO<Contrato> respuesta = service.registrarCarritoTransaccional(carrito);
		if(!respuesta.isSuccess()) {
			respuesta.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<APIResponseDTO<Contrato>>(respuesta, HttpStatus.BAD_REQUEST);
		}
		respuesta.setStatusCode(HttpStatus.OK.value());
		return new ResponseEntity<APIResponseDTO<Contrato>>(respuesta, HttpStatus.OK);
	}

}
