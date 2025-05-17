package com.surrender.repo;

import java.util.List;

import com.surrender.model.Material;

public interface IMaterialRepo extends IGenericRepo<Material, Integer> {
	List<Material> findByEstadoTrueOrderByNombreAsc();
}
