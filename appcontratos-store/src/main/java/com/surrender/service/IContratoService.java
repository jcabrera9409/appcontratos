package com.surrender.service;

import com.surrender.dto.APIResponseDTO;
import com.surrender.dto.CarritoDTO;
import com.surrender.model.Contrato;

public interface IContratoService extends ICRUD<Contrato, Integer> {
	APIResponseDTO<Contrato> registrarCarritoTransaccional(CarritoDTO carrito);
}
