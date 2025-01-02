package com.surrender.repo;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.surrender.model.Contrato;
import jakarta.transaction.Transactional;

public interface IContratoRepo extends IGenericRepo<Contrato, Integer> {
	@Transactional
	@Modifying
	@Query("UPDATE Contrato c SET c.estado = :estado WHERE c.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") String estado);
	
	Contrato findByCodigo(String codigo);
}
