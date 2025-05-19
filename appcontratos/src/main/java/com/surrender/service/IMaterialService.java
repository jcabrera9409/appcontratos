package com.surrender.service;

import java.time.LocalDateTime;

import com.surrender.model.DetalleMaterial;
import com.surrender.model.Material;

public interface IMaterialService extends ICRUD<Material, Integer> {

	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	DetalleMaterial registrarDetalle(DetalleMaterial obj);
	DetalleMaterial modificarDetalle(DetalleMaterial obj);
	int actualizarEstadoDetallePorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
}
