package com.surrender.repo;

import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.DetalleComprobante;

import jakarta.transaction.Transactional;

public interface IDetalleComprobanteRepo extends IGenericRepo<DetalleComprobante, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE DetalleComprobante d SET d.veces_enviado = :veces_enviado WHERE d.id = :id")
	int updateVecesEnviado(
			@Param("id") Integer id, 
		    @Param("veces_enviado") int veces_enviado
			);
	
}
