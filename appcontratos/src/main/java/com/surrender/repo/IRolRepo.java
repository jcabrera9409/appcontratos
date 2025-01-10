package com.surrender.repo;

import java.util.Optional;

import com.surrender.model.Rol;

public interface IRolRepo extends IGenericRepo<Rol, Integer>{
	Optional<Rol> findByNombre(String nombre);
}
