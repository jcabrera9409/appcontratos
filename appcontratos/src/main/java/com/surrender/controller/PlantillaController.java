package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.exception.ModeloNotFoundException;
import com.surrender.model.Plantilla;
import com.surrender.service.IPlantillaService;

@RestController
@RequestMapping("/plantillas")
@PreAuthorize("@authenticationService.tieneAcceso('plantilla')")
public class PlantillaController {

	@Autowired
	private IPlantillaService service;
	
	@GetMapping
	@PreAuthorize("@authenticationService.tieneAcceso('plantilla-listar')")
	public ResponseEntity<?> listar() throws Exception {
		List<Plantilla> lista = service.listar();
		return new ResponseEntity<List<Plantilla>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("@authenticationService.tieneAcceso('plantilla-listar')")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Plantilla obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Plantilla no encontrada " + id);
		}
		
		return new ResponseEntity<Plantilla>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Plantilla v) throws Exception {
		Plantilla obj = service.registrar(v);
		return new ResponseEntity<Plantilla>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Plantilla v) throws Exception {
		Plantilla obj = service.modificar(v);
		return new ResponseEntity<Plantilla>(obj, HttpStatus.CREATED);
	}
}
