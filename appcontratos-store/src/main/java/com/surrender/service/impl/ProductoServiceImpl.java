package com.surrender.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.surrender.model.Producto;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IProductoRepo;
import com.surrender.service.IProductoService;

@Service
public class ProductoServiceImpl extends CRUDImpl<Producto, Integer> implements IProductoService {

	@Autowired
	private IProductoRepo repo = null;
	
	@Override
	protected IGenericRepo<Producto, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public Page<Producto> listarProductosPorCategorias(List<Integer> idsCategorias, Integer listarTodo, String nombre, Pageable pageable) {
		return repo.listarProductosPorCategorias(idsCategorias, listarTodo, nombre, pageable);
	}

	public Optional<Producto> listarPorSlug(String slug) {
		return repo.findBySlug(slug);
	}
	
}
