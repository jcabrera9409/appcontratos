package com.surrender.service;

import java.time.LocalDateTime;

import com.surrender.model.Contrato;

public interface IContratoService extends ICRUD<Contrato, Integer> {
	Contrato registrarContratoTransaccional(Contrato contrato);
	Contrato modificarContratoTransaccional(Contrato contrato);
	int actualizarEstadoPorId(Integer id, String estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion);
	Contrato listarPorCodigo(String codigo);
}
