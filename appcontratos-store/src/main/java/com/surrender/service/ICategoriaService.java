package com.surrender.service;

import java.util.List;

import com.surrender.dto.ArbolCategoriaDTO;
import com.surrender.model.Categoria;

public interface ICategoriaService extends ICRUD<Categoria, Integer> {	
	public List<ArbolCategoriaDTO> countProductosPorCategoria();
}
