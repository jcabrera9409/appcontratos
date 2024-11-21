package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.surrender.model.Contrato;
import com.surrender.service.IContratoService;

@RestController
@RequestMapping("/contratos")
public class ContratoController {

	@Autowired
	private IContratoService service;

	@GetMapping
	public ResponseEntity<?> listar() throws Exception {
		List<Contrato> lista = service.listar();
		return new ResponseEntity<List<Contrato>>(lista, HttpStatus.OK);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<?> listarPorId(@PathVariable Integer id) throws Exception {
		Contrato obj = service.listarPorId(id);
		
		if(obj == null) {
			throw new ModeloNotFoundException("Contrato no encontrado " + id);
		}
		
		return new ResponseEntity<Contrato>(obj, HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Contrato c) throws Exception {
		System.out.println(c.getDetalleContrato().get(0).getObjPlantilla());
		Contrato obj = service.registrarContratoTransaccional(c);
		return new ResponseEntity<Contrato>(obj, HttpStatus.CREATED);
	}
	
	/*@PostMapping
	public ResponseEntity<?> registrar(@RequestBody Contrato c) throws Exception {
		Contrato obj = service.registrar(c);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getId()).toUri();
		return ResponseEntity.created(location).build();
	}*/
	
	@PutMapping
	public ResponseEntity<?> modificar(@RequestBody Contrato c) throws Exception {
		Contrato obj = service.modificar(c);
		return new ResponseEntity<Contrato>(obj, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<?> eliminar(@PathVariable Integer id) throws Exception {
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
}
