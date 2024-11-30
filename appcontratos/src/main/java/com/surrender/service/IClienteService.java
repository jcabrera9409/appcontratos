package com.surrender.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.surrender.model.Cliente;

public interface IClienteService extends ICRUD<Cliente, Integer> {

	Cliente listarPorDocumentoCliente(String documentoCliente);
	
	Page<Cliente> listarPageable(Pageable pageable);
}
