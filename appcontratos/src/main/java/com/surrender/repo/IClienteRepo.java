package com.surrender.repo;

import com.surrender.model.Cliente;

public interface IClienteRepo extends IGenericRepo<Cliente, Integer> {

	Cliente findByDocumentoCliente(String documentoCliente);
	
}
