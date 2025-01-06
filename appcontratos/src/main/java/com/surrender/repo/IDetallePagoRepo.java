package com.surrender.repo;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.DetallePago;

import jakarta.transaction.Transactional;

public interface IDetallePagoRepo extends IGenericRepo<DetallePago, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE DetallePago d SET d.estado = :estado, d.objVendedorActualizacion.id = :vendedorId, d.fechaActualizacion = :fechaActualizacion WHERE d.id = :id")
	int updateEstadoById(
			@Param("id") Integer id, 
			@Param("estado") boolean estado,  
			@Param("vendedorId") Integer vendedorId, 
		    @Param("fechaActualizacion") LocalDateTime fechaActualizacion
			);
	
}
