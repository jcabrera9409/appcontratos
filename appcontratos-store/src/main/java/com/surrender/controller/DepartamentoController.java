package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Departamento;
import com.surrender.service.IDepartamentoService;

@RestController
@RequestMapping("/departamentos")
public class DepartamentoController {

	@Autowired
	private IDepartamentoService service;
	
	@GetMapping
	public ResponseEntity<?> listarDepartamentos() throws Exception{
		List<Departamento> lista = service.listar();
		return new ResponseEntity<List<Departamento>>(lista, HttpStatus.OK);
	}
	
}
