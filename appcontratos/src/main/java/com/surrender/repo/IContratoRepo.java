package com.surrender.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.surrender.model.Contrato;
import jakarta.transaction.Transactional;

public interface IContratoRepo extends IGenericRepo<Contrato, Integer> {
	@Transactional
	@Modifying
	@Query("UPDATE Contrato c SET c.estado = :estado, c.objVendedorActualizacion.id = :vendedorId, c.fechaActualizacion = :fechaActualizacion WHERE c.id = :id")
	int updateEstadoById(
	    @Param("id") Integer id, 
	    @Param("estado") String estado, 
	    @Param("vendedorId") Integer vendedorId, 
	    @Param("fechaActualizacion") LocalDateTime fechaActualizacion
	    );
	
	Contrato findByCodigo(String codigo);
	
	List<Contrato> findByEstadoNot(String estado);
}
