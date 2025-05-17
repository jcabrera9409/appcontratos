package com.surrender.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Material;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IMaterialRepo;
import com.surrender.service.IMaterialService;

@Service
public class MaterialServiceImpl extends CRUDImpl<Material, Integer> implements IMaterialService {

	@Autowired
	private IMaterialRepo repo;
	
	@Override
	protected IGenericRepo<Material, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public List<Material> listarMaterialesActivos() {
		return repo.findByEstadoTrueOrderByNombreAsc();
	}


}
