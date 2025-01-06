package com.surrender.controller;

import java.util.ArrayList;
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
import com.surrender.model.Menu;
import com.surrender.service.IMenuService;

@RestController
@RequestMapping("/menu")
@PreAuthorize("@authenticationService.tieneAcceso('menu')")
public class MenuController {

	@Autowired
	private IMenuService service;

	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Menu> lista = service.listar();
		return new ResponseEntity<List<Menu>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Menu obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Menu no encontrado " + id);
		}
		
		return new ResponseEntity<Menu>(obj, HttpStatus.OK);
	}
	
	@PreAuthorize("@authenticationService.tieneAcceso('menu-listar-correo')")
	@PostMapping("/correo")
	public ResponseEntity<?> listarPorCorreo(@RequestBody String correo) throws Exception {
		List<Menu> menus = new ArrayList<>();
		menus = service.listarMenusByVendedorCorreo(correo);
		return new ResponseEntity<List<Menu>>(menus, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Menu m) throws Exception {
		Menu obj = service.registrar(m);
		return new ResponseEntity<Menu>(obj, HttpStatus.CREATED);
	}
	
	/*@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Menu m) throws Exception {
		Menu obj = service.registrar(m);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
		return ResponseEntity.created(location).build();
	}*/
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Menu m) throws Exception {
		Menu obj = service.modificar(m);
		return new ResponseEntity<Menu>(obj, HttpStatus.CREATED);
	}
}
