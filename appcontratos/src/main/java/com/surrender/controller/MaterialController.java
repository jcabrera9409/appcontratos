package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.DetalleMaterial;
import com.surrender.model.Material;
import com.surrender.service.IMaterialService;

import dto.ChangeStatusRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/materiales")
@PreAuthorize("@authenticationService.tieneAcceso('material')")
public class MaterialController {

	@Autowired
	private IMaterialService service;
	
	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Material> lista = service.listar();
		return new ResponseEntity<List<Material>>(lista, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Material obj) throws Exception {
		Material result = service.registrar(obj);
		return new ResponseEntity<Material>(result, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Material obj) throws Exception {
		Material result = service.modificar(obj);
		return new ResponseEntity<Material>(result, HttpStatus.CREATED);
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
	
	@PostMapping("detalle")
	public ResponseEntity<?> registrarDetalle(@RequestBody DetalleMaterial obj) throws Exception {
		DetalleMaterial result = service.registrarDetalle(obj);
		return new ResponseEntity<DetalleMaterial>(result, HttpStatus.CREATED);
	}
	
	@PutMapping("detalle")
	public ResponseEntity<?> modificarDetalle(@RequestBody DetalleMaterial obj) throws Exception {
		DetalleMaterial result = service.modificarDetalle(obj);
		return new ResponseEntity<DetalleMaterial>(result, HttpStatus.CREATED);
	}
	
	@PutMapping("detalle/cambiar_estado")
	public ResponseEntity<?> cambiarEstadoDetalle(@RequestBody ChangeStatusRequest request) throws Exception {
		int filasAfectadas = service.actualizarEstadoDetallePorId(request.getId(), request.isEstado(), request.getObjVendedor().getCorreo(), request.getFechaActualizacion());
		if(filasAfectadas > 0) {			
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		else
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
	}
	
}
