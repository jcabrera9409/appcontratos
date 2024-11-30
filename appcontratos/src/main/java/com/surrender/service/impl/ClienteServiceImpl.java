package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.surrender.model.Cliente;
import com.surrender.repo.IClienteRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.service.IClienteService;

@Service
public class ClienteServiceImpl extends CRUDImpl<Cliente, Integer> implements IClienteService {

	@Autowired
	private IClienteRepo repo = null;
	
	@Override
	protected IGenericRepo<Cliente, Integer> getRepo() {
		return repo;
	}

	@Override
	public Cliente listarPorDocumentoCliente(String documentoCliente) {
		return repo.findByDocumentoCliente(documentoCliente);
	}

	@Override
	public Page<Cliente> listarPageable(Pageable pageable) {
		return repo.findAll(pageable);
	}

}
