package com.surrender.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Comprobante;
import com.surrender.service.IComprobanteService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;




@RestController
@RequestMapping("/comprobantes")
@PreAuthorize("@authenticationService.tieneAcceso('comprobante')")
public class ComprobanteController {

	@Autowired
	private IComprobanteService service;
	
	@GetMapping("/contrato/{codigo}")
	public ResponseEntity<?> buscarPorCodigoContrato(@PathVariable String codigo) throws Exception {
		Optional<Comprobante> comprobante = service.buscarPorCodigoContrato(codigo);
		if(comprobante.isPresent()) {
			return new ResponseEntity<Comprobante>(comprobante.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
	
	@PostMapping
	public ResponseEntity<?> registrarComprobante(@RequestBody Comprobante c) throws Exception {
		Comprobante obj = service.registrar(c);
		return new ResponseEntity<Comprobante>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Comprobante c) throws Exception {
		Comprobante obj = service.modificar(c);
		return new ResponseEntity<Comprobante>(obj, HttpStatus.CREATED);
	}
	
}
