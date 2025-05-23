package com.surrender.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.surrender.model.Contrato;
import com.surrender.model.DetallePago;

import dto.ReporteContratosIngresosDTO;
import dto.ReporteTipoAbonoDTO;

public interface IContratoService extends ICRUD<Contrato, Integer> {
	Contrato registrarContratoTransaccional(Contrato contrato);
	Contrato modificarContratoTransaccional(Contrato contrato);
	int actualizarEstadoPorId(Integer id, String estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	Contrato listarPorCodigo(String codigo);
	DetallePago registrarDetallePago(DetallePago detallePago);
	int actualizarEstadoDetallePagoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	List<Contrato> listarEstadoDiferente(List<String> estados);
	Page<Contrato> listarPageable(String keyword, Pageable pageable);
	
	List<ReporteContratosIngresosDTO> obtenerReporteContratosIngresos(LocalDate fechaInicio, LocalDate fechaFin);
	List<ReporteTipoAbonoDTO> obtenerReporteTipoAbono(LocalDate fechaInicio, LocalDate fechaFin);
}
