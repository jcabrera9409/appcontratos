package com.surrender.service;

import com.surrender.dto.APIResponseDTO;
import com.surrender.model.Reclamo;

public interface IReclamoService extends ICRUD<Reclamo, Integer> {
	APIResponseDTO<Reclamo> registrarReclamo(Reclamo reclamo);
}
