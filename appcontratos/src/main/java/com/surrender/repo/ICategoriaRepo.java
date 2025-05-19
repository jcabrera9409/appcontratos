package com.surrender.repo;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.Categoria;

import jakarta.transaction.Transactional;

public interface ICategoriaRepo extends IGenericRepo<Categoria, Integer> {

	@Transactional
	@Modifying
	@Query("UPDATE Categoria c SET c.estado = :estado, c.objVendedorActualizacion.id = :vendedorId, c.fechaActualizacion = :fechaActualizacion WHERE c.id = :id")
	int updateEstadoById(@Param("id") Integer id, @Param("estado") boolean estado,
			@Param("vendedorId") Integer vendedorId, @Param("fechaActualizacion") LocalDateTime fechaActualizacion);
	
	List<Categoria> findByObjPadreIsNullOrderByNombre();
	
	@Query("SELECT c.slug FROM Categoria c WHERE c.slug LIKE CONCAT(:slugBase, '%')")
	List<String> findAllSlugLike(@Param("slugBase") String slugBase);
}
