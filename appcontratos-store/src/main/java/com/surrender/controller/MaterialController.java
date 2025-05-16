package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Material;
import com.surrender.service.IMaterialService;

@RestController
@RequestMapping("/material")
public class MaterialController {

	@Autowired
	private IMaterialService service;
	
	@GetMapping
	public ResponseEntity<?> listarMaterialesActivos() {
		List<Material> lista = service.listarMaterialesActivos();
		return new ResponseEntity<List<Material>>(lista, HttpStatus.OK);
	}
	
}
