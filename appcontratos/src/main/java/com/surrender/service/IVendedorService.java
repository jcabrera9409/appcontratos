package com.surrender.service;

import java.time.LocalDateTime;
import java.util.Optional;

import com.surrender.model.Vendedor;

public interface IVendedorService extends ICRUD<Vendedor, Integer> {
	Optional<Vendedor> listarPorCorreo(String correo);
	
	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
}
