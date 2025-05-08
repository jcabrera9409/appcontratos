package com.surrender.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.dto.ArbolCategoriaDTO;
import com.surrender.service.ICategoriaService;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

	@Autowired
	private ICategoriaService service;
		
	@GetMapping("/arbol")
	public ResponseEntity<?> listarArbolCategorias() {
		List<ArbolCategoriaDTO> lista = service.countProductosPorCategoria();
		return new ResponseEntity<List<ArbolCategoriaDTO>>(lista, HttpStatus.OK);
	}
	
	
}
