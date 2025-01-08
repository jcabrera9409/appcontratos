package com.surrender.repo;

import java.util.Optional;

import com.surrender.model.Comprobante;

public interface IComprobanteRepo extends IGenericRepo<Comprobante, Integer> {
	
	Optional<Comprobante> findByObjContratoCodigo(String codigo);

}
