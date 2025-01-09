package com.surrender.service;

import java.util.Optional;

import com.surrender.model.Comprobante;
import com.surrender.model.DetalleComprobante;

public interface IComprobanteService extends ICRUD<Comprobante, Integer> {

	Optional<Comprobante> buscarPorCodigoContrato(String codigo);
	DetalleComprobante registrarDetalleComprobante(DetalleComprobante detalleComprobante);
}
