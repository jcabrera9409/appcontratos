package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.exception.ModeloNotFoundException;
import com.surrender.model.Vendedor;
import com.surrender.service.IVendedorService;

@RestController
@RequestMapping("/vendedores")
@PreAuthorize("@authenticationService.tieneAcceso('vendedor')")
public class VendedorController {

	@Autowired
	private IVendedorService service;

	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Vendedor> lista = service.listar();
		return new ResponseEntity<List<Vendedor>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Vendedor obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Vendedor no encontrado " + id);
		}
		
		return new ResponseEntity<Vendedor>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Vendedor v) throws Exception {
		Vendedor obj = service.registrar(v);
		return new ResponseEntity<Vendedor>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Vendedor v) throws Exception {
		Vendedor obj = service.modificar(v);
		return new ResponseEntity<Vendedor>(obj, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer id) throws Exception {
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
}
