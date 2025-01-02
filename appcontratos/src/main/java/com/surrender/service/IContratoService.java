package com.surrender.service;

import com.surrender.model.Contrato;

public interface IContratoService extends ICRUD<Contrato, Integer> {
	Contrato registrarContratoTransaccional(Contrato contrato);
	Contrato modificarContratoTransaccional(Contrato contrato);
	int actualizarEstadoPorId(Integer id, String estado);
	Contrato listarPorCodigo(String codigo);
}
