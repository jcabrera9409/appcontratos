package com.surrender.service;

import java.util.Optional;

import com.surrender.model.Comprobante;

public interface IComprobanteService extends ICRUD<Comprobante, Integer> {

	Optional<Comprobante> buscarPorCodigoContrato(String codigo);
}
