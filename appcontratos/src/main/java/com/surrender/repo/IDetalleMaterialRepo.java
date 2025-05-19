package com.surrender.repo;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.DetalleMaterial;

import jakarta.transaction.Transactional;

public interface IDetalleMaterialRepo extends IGenericRepo<DetalleMaterial, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE DetalleMaterial x SET x.estado = :estado, x.objVendedorActualizacion.id = :vendedorId, x.fechaActualizacion = :fechaActualizacion WHERE x.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") boolean estado,
			@Param("vendedorId") Integer vendedorId, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
}
