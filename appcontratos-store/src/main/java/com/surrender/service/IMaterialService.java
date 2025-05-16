package com.surrender.service;

import java.util.List;

import com.surrender.model.Material;

public interface IMaterialService extends ICRUD<Material, Integer> {
	List<Material> listarMaterialesActivos();
}
