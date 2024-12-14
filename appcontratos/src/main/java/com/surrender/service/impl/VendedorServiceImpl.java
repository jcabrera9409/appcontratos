package com.surrender.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Vendedor;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IVendedorService;

@Service
public class VendedorServiceImpl extends CRUDImpl<Vendedor, Integer> implements IVendedorService {

	@Autowired
	private IVendedorRepo repo = null;
	
	@Override
	protected IGenericRepo<Vendedor, Integer> getRepo() {
		return repo;
	}

	@Override
	public Optional<Vendedor> listarPorCorreo(String correo) {
		return repo.findByCorreo(correo);
	}
	
}
