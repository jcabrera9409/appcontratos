package com.surrender.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.model.Producto;
import com.surrender.service.IProductoService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/productos")
public class ProductoController {

	@Autowired
	private IProductoService service;
	
	@Autowired
	private PagedResourcesAssembler<Producto> pagedAssembler;
	
	@GetMapping("/filtrar")
	public ResponseEntity<?> listarProductosPorCategoria(
			@RequestParam(required = false) List<Integer> idsCategorias,
			@RequestParam(defaultValue = "1") Integer listarTodo,
			@RequestParam(defaultValue = "") String nombre,
			Pageable pageable
	) {
		Page<Producto> lista = service.listarProductosPorCategorias(idsCategorias, listarTodo, nombre, pageable);
		PagedModel<EntityModel<Producto>> pagedModel = pagedAssembler.toModel(lista);
		return new ResponseEntity<PagedModel<EntityModel<Producto>>>(pagedModel, HttpStatus.OK);
	}
	
	@GetMapping("/{slug}")
	public ResponseEntity<?> listarPorSlug(@PathVariable String slug) {
		Optional<Producto> optional = service.listarPorSlug(slug);
		if(optional.isPresent()) {
			return new ResponseEntity<Producto>(optional.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}
	}
	
	
}
