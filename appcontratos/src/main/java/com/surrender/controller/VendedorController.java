package com.surrender.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.surrender.service.impl.AuthenticationService;

import dto.ChangeStatusRequest;

@RestController
@RequestMapping("/vendedores")
@PreAuthorize("@authenticationService.tieneAcceso('vendedor')")
public class VendedorController {

	@Autowired
	private IVendedorService service;
	
	@Autowired
	private AuthenticationService authenticationService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
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
		Optional<Vendedor> busqueda = service.listarPorCorreo(v.getCorreo());
		if(!busqueda.isPresent()) {
			v.setPassword(passwordEncoder.encode(v.getPassword()));
			Vendedor obj = service.registrar(v);
			return new ResponseEntity<Vendedor>(obj, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<Vendedor>(busqueda.get(), HttpStatus.CONFLICT);
		}
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Vendedor v) throws Exception {
		Vendedor busqueda = service.listarPorId(v.getId());
		v.setCorreo(busqueda.getCorreo());
		v.setEstado(busqueda.isEstado());
		v.setPassword(busqueda.getPassword());
		
		Vendedor obj = service.modificar(v);
		return new ResponseEntity<Vendedor>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping("cambiar_estado")
	public ResponseEntity<?> cambiarEstado(@RequestBody ChangeStatusRequest request) throws Exception {
		int filasAfectadas = service.actualizarEstadoPorId(request.getId(), request.isEstado());
		if(filasAfectadas > 0) {
			if(!request.isEstado()) {
				Vendedor v = new Vendedor();
				v.setId(request.getId());
				this.authenticationService.revokeAllTokenByVendedor(v);
			}			
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer id) throws Exception {
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
}
