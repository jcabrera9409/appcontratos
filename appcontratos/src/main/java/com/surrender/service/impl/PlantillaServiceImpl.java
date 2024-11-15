package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Plantilla;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IPlantillaRepo;
import com.surrender.service.IPlantillaService;

@Service
public class PlantillaServiceImpl extends CRUDImpl<Plantilla, Integer> implements IPlantillaService {

	@Autowired
	private IPlantillaRepo repo = null;
	
	@Override
	protected IGenericRepo<Plantilla, Integer> getRepo() {
		return repo;
	}

}
