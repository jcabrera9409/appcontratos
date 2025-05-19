package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Categoria;
import com.surrender.service.ICategoriaService;

import dto.ChangeStatusRequest;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/categorias")
@PreAuthorize("@authenticationService.tieneAcceso('categoria')")
public class CategoriaController {

	@Autowired
	private ICategoriaService service;
	
	@GetMapping
	public ResponseEntity<?> listar() throws Exception{
		List<Categoria> lista = service.listarCategoriasPadres();
		return new ResponseEntity<List<Categoria>>(lista, HttpStatus.OK);		
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Categoria c) throws Exception {
		Categoria obj = service.registrar(c);
		return new ResponseEntity<Categoria>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Categoria c) throws Exception {
		Categoria obj = service.modificar(c);
		return new ResponseEntity<Categoria>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping("cambiar_estado")
	public ResponseEntity<?> cambiarEstado(@RequestBody ChangeStatusRequest request) throws Exception {
		int filasAfectadas = service.actualizarEstadoPorId(request.getId(), request.isEstado(), request.getObjVendedor().getCorreo(), request.getFechaActualizacion());
		if(filasAfectadas > 0) {			
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
}
