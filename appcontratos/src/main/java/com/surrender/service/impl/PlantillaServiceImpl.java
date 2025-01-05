package com.surrender.service.impl;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Plantilla;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IPlantillaRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IPlantillaService;

@Service
public class PlantillaServiceImpl extends CRUDImpl<Plantilla, Integer> implements IPlantillaService {

	@Autowired
	private IPlantillaRepo repo = null;
	
	@Autowired
	private IVendedorRepo repoVendedor = null;
	
	@Override
	protected IGenericRepo<Plantilla, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public Plantilla registrar(Plantilla plantilla) {
		if(!plantilla.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			plantilla.setObjVendedorActualizacion(repoVendedor.findByCorreo(plantilla.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(plantilla);
	}
	
	@Override
	public Plantilla modificar(Plantilla plantilla) {
		if(!plantilla.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			plantilla.setObjVendedorActualizacion(repoVendedor.findByCorreo(plantilla.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(plantilla);
	}

}
