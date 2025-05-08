package com.surrender.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;

import com.surrender.dto.ArbolCategoriaDTO;
import com.surrender.model.Categoria;

public interface ICategoriaRepo extends IGenericRepo<Categoria, Integer> {
	List<Categoria> findByEstadoTrueOrderByNombreAsc();

	@Query("""
				SELECT new com.surrender.dto.ArbolCategoriaDTO(c.id, c.nombre, c.slug, COUNT(p.id))
			    FROM Categoria c
			    LEFT JOIN Producto p ON p.objCategoria.id = c.id AND p.estado = true
			    WHERE c.estado = true
			    GROUP BY c.id, c.nombre
			    ORDER BY c.nombre ASC
			""")
	List<ArbolCategoriaDTO> countProductosPorCategoria();
}
