package com.surrender.service;

import com.surrender.model.Contrato;

public interface IContratoService extends ICRUD<Contrato, Integer> {
	Contrato registrarContratoTransaccional(Contrato contrato);
}
