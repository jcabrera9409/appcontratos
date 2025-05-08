package com.surrender.repo;

import java.util.Optional;

import com.surrender.model.Vendedor;

public interface IVendedorRepo extends IGenericRepo<Vendedor, Integer> {
	
	Optional<Vendedor> findByCorreo(String correo);

}
