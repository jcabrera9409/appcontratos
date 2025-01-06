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
import com.surrender.model.Rol;
import com.surrender.service.IRolService;

@RestController
@RequestMapping("/roles")
@PreAuthorize("@authenticationService.tieneAcceso('rol')")
public class RolController {

	@Autowired
	private IRolService service;

	@GetMapping
	@PreAuthorize("@authenticationService.tieneAcceso('rol-listar')")
	public ResponseEntity<?> listar() throws Exception {
		List<Rol> lista = service.listar();
		return new ResponseEntity<List<Rol>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	@PreAuthorize("@authenticationService.tieneAcceso('rol-listar')")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Rol obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Rol no encontrado " + id);
		}
		
		return new ResponseEntity<Rol>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Rol m) throws Exception {
		Rol obj = service.registrar(m);
		return new ResponseEntity<Rol>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Rol m) throws Exception {
		Rol obj = service.modificar(m);
		return new ResponseEntity<Rol>(obj, HttpStatus.CREATED);
	}
}
