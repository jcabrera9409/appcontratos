package com.surrender.service.impl;

import java.util.List;

import com.surrender.repo.IGenericRepo;
import com.surrender.service.ICRUD;

public abstract class CRUDImpl<T, ID> implements ICRUD<T, ID> {
	
	protected abstract IGenericRepo<T, ID> getRepo();
	
	@Override
	public List<T> listar() throws Exception {
		return getRepo().findAll();
	}

	@Override
	public T listarPorId(ID id) throws Exception {
		return getRepo().findById(id).orElse(null);
	}
}
