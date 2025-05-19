package com.surrender.service;

import java.time.LocalDateTime;
import java.util.List;

import com.surrender.model.Categoria;

public interface ICategoriaService extends ICRUD<Categoria, Integer> {

	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	List<Categoria> listarCategoriasPadres();
}
