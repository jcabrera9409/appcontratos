package com.surrender.service.impl;

import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Comprobante;
import com.surrender.repo.IComprobanteRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IComprobanteService;

@Service
public class ComprobanteServiceImpl extends CRUDImpl<Comprobante, Integer> implements IComprobanteService {

	@Autowired
	private IComprobanteRepo repo;
	
	@Autowired
	private IVendedorRepo repoVendedor;
	
	@Override
	protected IGenericRepo<Comprobante, Integer> getRepo() {
		return repo;
	}

	@Override
	public Optional<Comprobante> buscarPorCodigoContrato(String codigo) {
		return repo.findByObjContratoCodigo(codigo);
	}
	
	@Override
	public Comprobante registrar(Comprobante c) {
		int idVendedor = 0;
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get().getId();
			c.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repo.save(c);
	}

	@Override
	public Comprobante modificar(Comprobante c) {
		int idVendedor = 0;
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get().getId();
			c.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repo.save(c);
	}
}
