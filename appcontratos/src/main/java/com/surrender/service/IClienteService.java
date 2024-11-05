package com.surrender.service;

import com.surrender.model.Cliente;

public interface IClienteService extends ICRUD<Cliente, Integer> {

	Cliente listarPorDocumentoCliente(String documentoCliente);
}
