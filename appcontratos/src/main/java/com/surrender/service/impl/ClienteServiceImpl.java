package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.surrender.model.Cliente;
import com.surrender.repo.IClienteRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.service.IClienteService;
import com.surrender.util.UtilMethods;

@Service
public class ClienteServiceImpl extends CRUDImpl<Cliente, Integer> implements IClienteService {

	@Autowired
	private IClienteRepo repo = null;
	
	@Autowired
    private ApiPeruService apiPeruService;
	
	@Override
	protected IGenericRepo<Cliente, Integer> getRepo() {
		return repo;
	}

	@Override
	public Cliente listarPorDocumentoCliente(String documentoCliente) {
		Cliente cliente = repo.findByDocumentoCliente(documentoCliente);
		
		if(cliente == null) {
			if(UtilMethods.esDni(documentoCliente)) {
				cliente = apiPeruService.obtenerClientePorDNI(documentoCliente);
			}
			else if (UtilMethods.esRuc(documentoCliente)) {
				cliente = apiPeruService.obtenerClientePorRUC(documentoCliente);
			}
			
			if(cliente != null) {
				cliente = repo.save(cliente);
			}
		}
		
		return cliente;
	}

	@Override
	public Page<Cliente> listarPageable(Pageable pageable) {
		return repo.findAll(pageable);
	}

}
