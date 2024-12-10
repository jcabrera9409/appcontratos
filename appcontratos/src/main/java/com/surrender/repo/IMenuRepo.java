package com.surrender.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.surrender.model.Menu;

public interface IMenuRepo extends IGenericRepo<Menu, Integer> {

	@Query("SELECT DISTINCT m FROM Menu m JOIN m.roles r JOIN r.vendedores v WHERE v.correo = :correo")
	List<Menu> findAllMenusByVendedorCorreo(String correo);
	
}
