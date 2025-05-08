package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Departamento;
import com.surrender.repo.IDepartamentoRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.service.IDepartamentoService;

@Service
public class DepartamentoServiceImpl extends CRUDImpl<Departamento, Integer> implements IDepartamentoService {

	@Autowired
	private IDepartamentoRepo repo = null;
	
	@Override
	protected IGenericRepo<Departamento, Integer> getRepo() {
		return repo;
	}
}
