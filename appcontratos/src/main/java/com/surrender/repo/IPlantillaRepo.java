package com.surrender.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.Plantilla;

import jakarta.transaction.Transactional;

public interface IPlantillaRepo extends IGenericRepo<Plantilla, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE Plantilla p SET p.estado = :estado, p.objVendedorActualizacion.id = :vendedorId, p.fechaActualizacion = :fechaActualizacion WHERE p.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") boolean estado,
			@Param("vendedorId") Integer vendedorId, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
	
	List<Plantilla> findByEstadoTrue();
}
