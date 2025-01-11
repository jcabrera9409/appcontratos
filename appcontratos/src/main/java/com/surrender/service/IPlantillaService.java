package com.surrender.service;

import java.time.LocalDateTime;
import java.util.List;

import com.surrender.model.Plantilla;

public interface IPlantillaService extends ICRUD<Plantilla, Integer> {

	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	List<Plantilla> listarPlantillasActivas();
}
