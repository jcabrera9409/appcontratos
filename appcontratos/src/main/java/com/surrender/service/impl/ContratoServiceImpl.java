package com.surrender.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Contrato;
import com.surrender.repo.IClienteRepo;
import com.surrender.repo.IContratoRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IContratoService;

import jakarta.transaction.Transactional;

@Service
public class ContratoServiceImpl extends CRUDImpl<Contrato, Integer> implements IContratoService{

	@Autowired
	private IContratoRepo repo;
	
	@Autowired
	private IClienteRepo repoCliente;
	
	@Autowired
	private IVendedorRepo repoVendedor;

	@Override
	protected IGenericRepo<Contrato, Integer> getRepo() {
		return repo;
	}

	@Transactional
	@Override
	public Contrato registrarContratoTransaccional(Contrato contrato) {
		if(contrato.getObjCliente().getId() <= 0) {
			contrato.setObjCliente(repoCliente.save(contrato.getObjCliente()));
		}
		
		if(!contrato.getObjVendedor().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			contrato.setObjVendedor(repoVendedor.findByCorreo(contrato.getObjVendedor().getCorreo()).get());
		}
		
		contrato.getDetalleContrato().forEach(det -> det.setObjContrato(contrato));
		return repo.save(contrato); 
	}

	@Transactional
	@Override
	public Contrato modificarContratoTransaccional(Contrato contrato) {
		if(!contrato.getObjVendedor().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			contrato.setObjVendedor(repoVendedor.findByCorreo(contrato.getObjVendedor().getCorreo()).get());
		}
		
		contrato.getDetalleContrato().forEach(det -> det.setObjContrato(contrato));
		return repo.save(contrato);
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, String estado) {
		return repo.updateEstadoById(id, estado);
	}

	@Override
	public Contrato listarPorCodigo(String codigo) {
		return repo.findByCodigo(codigo);
	}

}
