package com.surrender.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.surrender.model.Plantilla;

import dto.ReportePlantillaIngresosDTO;

public interface IPlantillaService extends ICRUD<Plantilla, Integer> {

	int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	List<Plantilla> listarPlantillasActivas();
	
	List<ReportePlantillaIngresosDTO> obtenerReporteIngresosPorPlantilla(LocalDate fechaInicio, LocalDate fechaFin);
}
