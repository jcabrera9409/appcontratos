package com.surrender.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.dto.ArbolCategoriaDTO;
import com.surrender.model.Categoria;
import com.surrender.repo.ICategoriaRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.service.ICategoriaService;

@Service
public class CategoriaServiceImpl extends CRUDImpl<Categoria, Integer> implements ICategoriaService {

	@Autowired
	private ICategoriaRepo repo = null;
	
	@Override
	protected IGenericRepo<Categoria, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public List<ArbolCategoriaDTO> countProductosPorCategoria() {
		List<Categoria> categorias = repo.findByEstadoTrueOrderByNombreAsc();
		List<ArbolCategoriaDTO> planos = repo.countProductosPorCategoria();
		
		Map<Integer, ArbolCategoriaDTO> dtoMap = planos.stream()
				.collect(Collectors.toMap(ArbolCategoriaDTO::getId, Function.identity()));
		
		List<ArbolCategoriaDTO> raiz = new ArrayList<>();
		List<ArbolCategoriaDTO> rsp = new ArrayList<>();
		
		for(Categoria categoria : categorias) {
			if(categoria.getObjPadre() == null) {
				raiz.add(dtoMap.get(categoria.getId()));
			} else {
				ArbolCategoriaDTO padre = dtoMap.get(categoria.getObjPadre().getId());
				ArbolCategoriaDTO hijo = dtoMap.get(categoria.getId());
				
				if(padre != null && hijo != null && hijo.getCantidadProductos() > 0) {
					padre.addSubCategoria(hijo);
				}
			}
		}
		
		for(ArbolCategoriaDTO categoria : raiz) {
			if(categoria.getCantidadProductos() > 0) {
				rsp.add(categoria);
			}
		}
		
		return rsp;
	}
	
}
