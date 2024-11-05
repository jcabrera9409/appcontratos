package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Contrato;
import com.surrender.repo.IContratoRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.service.IContratoService;

import jakarta.transaction.Transactional;

@Service
public class ContratoServiceImpl extends CRUDImpl<Contrato, Integer> implements IContratoService{

	@Autowired
	private IContratoRepo repo = null;

	@Override
	protected IGenericRepo<Contrato, Integer> getRepo() {
		return repo;
	}

	@Transactional
	@Override
	public Contrato registrarContratoTransaccional(Contrato contrato) {
		//Insertar Cliente
		//Insertar Contrato
		//Insertar Detalle 
		contrato.getDetalleContrato().forEach(det -> det.setObjContrato(contrato));
		return repo.save(contrato); 
	}

}
