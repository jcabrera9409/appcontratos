package com.surrender.service;

import java.time.LocalDateTime;

import com.surrender.model.Producto;
import com.surrender.model.ProductoImagen;

public interface IProductoService extends ICRUD<Producto, Integer> {

	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	ProductoImagen registrarImagen(ProductoImagen obj) throws Exception;
	ProductoImagen modificarImagen(ProductoImagen obj) throws Exception;
	void eliminarImagen(Integer id) throws Exception;
}
