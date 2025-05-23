package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Producto;
import com.surrender.model.ProductoImagen;
import com.surrender.service.IProductoService;

import dto.ChangeStatusRequest;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/productos")
@PreAuthorize("@authenticationService.tieneAcceso('producto')")
public class ProductoController {

	@Autowired
	private IProductoService service;
	
	@GetMapping
	public ResponseEntity<?> listarProductos() throws Exception {
		List<Producto> lista = service.listar();
		return new ResponseEntity<List<Producto>>(lista, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrarProducto(Producto obj) throws Exception {
		Producto respuesta = service.registrar(obj);
		return new ResponseEntity<Producto>(respuesta, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificarProducto(Producto obj) throws Exception {
		Producto respuesta = service.modificar(obj);
		return new ResponseEntity<Producto>(respuesta, HttpStatus.OK);
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
	
	@PostMapping("imagen")
	public ResponseEntity<?> registrarImagen(ProductoImagen obj) throws Exception {
		ProductoImagen respuesta = service.registrarImagen(obj);
		return new ResponseEntity<ProductoImagen>(respuesta, HttpStatus.CREATED);
	}
	
	@PutMapping("imagen")
	public ResponseEntity<?> modificarImagen(ProductoImagen obj) throws Exception {
		ProductoImagen respuesta = service.modificarImagen(obj);
		return new ResponseEntity<ProductoImagen>(respuesta, HttpStatus.OK);
	}
	
	@DeleteMapping("imagen/{id}")
	public ResponseEntity<?> eliminarImagen(@PathVariable Integer id) throws Exception {
		service.eliminarImagen(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	
}
