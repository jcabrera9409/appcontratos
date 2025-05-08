package com.surrender.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.surrender.model.Producto;

public interface IProductoRepo extends IGenericRepo<Producto, Integer> {
	
	Optional<Producto> findByIdAndEstadoTrue(Integer id);
	public Optional<Producto> findBySlug(String slug);
	
	@Query("""
			SELECT p
			FROM Producto p
			WHERE (p.objCategoria.id IN :idsCategorias OR :listarTodo = 0) 
				AND p.estado = true
				AND (:nombre = '' OR UPPER(p.nombre) LIKE CONCAT('%', UPPER(:nombre), '%'))
			""")
	public Page<Producto> listarProductosPorCategorias(
			@Param("idsCategorias") List<Integer> idsCategorias, 
			@Param("listarTodo") Integer listarTodo,
			@Param("nombre") String nombre,
			Pageable pageable
	);
}
