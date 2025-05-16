package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.dto.APIResponseDTO;
import com.surrender.model.Reclamo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IReclamoRepo;
import com.surrender.service.IReclamoService;
import com.surrender.util.UtilMethods;

import jakarta.transaction.Transactional;

@Service
public class ReclamoServiceImpl extends CRUDImpl<Reclamo, Integer> implements IReclamoService {

	@Autowired
	private IReclamoRepo repo;

	@Override
	protected IGenericRepo<Reclamo, Integer> getRepo() {
		return repo;
	}
	
	@Transactional
	@Override
	public APIResponseDTO<Reclamo> registrarReclamo(Reclamo reclamo) {
		reclamo.setFechaReclamo(UtilMethods.obtenerFechaActualAmericaLima());
		reclamo.setCodigo("");
		Reclamo obj = repo.save(reclamo);
		obj.setCodigo(UtilMethods.generarCodigoReclamo(obj));
		obj = repo.save(obj);
		return APIResponseDTO.success("Reclamo registrado correctamente", obj, 0);
	}
}
