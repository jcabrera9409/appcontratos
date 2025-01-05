package com.surrender.repo;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.Vendedor;

import jakarta.transaction.Transactional;

public interface IVendedorRepo extends IGenericRepo<Vendedor, Integer> {
	
	Optional<Vendedor> findByCorreo(String correo);
	
	@Transactional
	@Modifying
	@Query("UPDATE Vendedor v SET v.password = :password WHERE v.id = :id")
	int updatePasswordById(@Param("id") Integer id, @Param("password") String password);
	
	@Transactional
	@Modifying
	@Query("UPDATE Vendedor v SET v.estado = :estado, v.objVendedorActualizacion.id = :vendedorId, v.fechaActualizacion = :fechaActualizacion WHERE v.id = :id")
	int updateEstadoById(
			@Param("id") Integer id, 
			@Param("estado") boolean estado,  
			@Param("vendedorId") Integer vendedorId, 
		    @Param("fechaActualizacion") LocalDateTime fechaActualizacion
			);

}
