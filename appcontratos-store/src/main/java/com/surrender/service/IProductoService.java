package com.surrender.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.surrender.model.Producto;

public interface IProductoService extends ICRUD<Producto, Integer> {

	Optional<Producto> listarPorSlug(String slug);
	Page<Producto> listarProductosPorCategorias(List<Integer> idsCategorias, Integer listarTodo, String nombre, Pageable pageable);
}
