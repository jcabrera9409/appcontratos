package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.exception.ModeloNotFoundException;
import com.surrender.model.Cliente;
import com.surrender.service.IClienteService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

	@Autowired
	private IClienteService service;

	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Cliente> lista = service.listar();
		return new ResponseEntity<List<Cliente>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Cliente obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Cliente no encontrado " + id);
		}
		
		return new ResponseEntity<Cliente>(obj, HttpStatus.OK);
	}
	
	@GetMapping("/documento/{documentoCliente}")
	public ResponseEntity<?> listarPorDni(@PathVariable String documentoCliente) throws Exception {
		Cliente obj = service.listarPorDocumentoCliente(documentoCliente);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Cliente no encontrado " + documentoCliente);
		}
		
		return new ResponseEntity<Cliente>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Cliente c) throws Exception {
		Cliente obj = service.registrar(c);
		return new ResponseEntity<Cliente>(obj, HttpStatus.CREATED);
	}
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Cliente c) throws Exception {
		Cliente obj = service.modificar(c);
		return new ResponseEntity<Cliente>(obj, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer id) throws Exception {
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	
	@GetMapping("/pageable")
	public ResponseEntity<Page<Cliente>> listarPageable(Pageable pageable) throws Exception {
		Page<Cliente> clientes = service.listarPageable(pageable);
		return new ResponseEntity<Page<Cliente>>(clientes, HttpStatus.OK);
	}
}
