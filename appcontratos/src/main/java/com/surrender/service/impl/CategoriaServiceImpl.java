package com.surrender.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Categoria;
import com.surrender.repo.ICategoriaRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.ICategoriaService;
import com.surrender.util.UtilMethods;

@Service
public class CategoriaServiceImpl extends CRUDImpl<Categoria, Integer> implements ICategoriaService {
	
	@Autowired
	private ICategoriaRepo repo;
	
	@Autowired 
	private IVendedorRepo repoVendedor;
	
	@Override
	protected IGenericRepo<Categoria, Integer> getRepo() {
		return repo;
	}

	@Override
	public List<Categoria> listarCategoriasPadres() {
		 List<Categoria> padres = repo.findByObjPadreIsNullOrderByNombre();
		    return padres.stream()
		        .map(this::clonarPadreConHijos)
		        .toList();
	}
	
	@Override
	public Categoria registrar(Categoria c) throws Exception {
		String slugBase = UtilMethods.generarSlugUnico(c.getNombre(), null);
		List<String> slugsExistentes = repo.findAllSlugLike(slugBase);
		slugBase = UtilMethods.generarSlugUnico(slugBase, slugsExistentes);
		
		c.setSlug(slugBase);
				
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			c.setObjVendedorActualizacion(repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repo.save(c);
	}
	
	@Override
	public Categoria modificar(Categoria c) throws Exception {
		Categoria original = repo.findById(c.getId()).get();
		
		if(!original.getNombre().equals(c.getNombre())) {
			String slugBase = UtilMethods.generarSlugUnico(c.getNombre(), null);
			List<String> slugsExistentes = repo.findAllSlugLike(slugBase);
			slugBase = UtilMethods.generarSlugUnico(slugBase, slugsExistentes);
			
			original.setSlug(slugBase);
		}
		
		original.setNombre(c.getNombre());
		original.setDescripcion(c.getDescripcion());
		original.setFechaActualizacion(c.getFechaActualizacion());
		
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			original.setObjVendedorActualizacion(repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repo.save(original);
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repo.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}
	
	private Categoria clonarPadreConHijos(Categoria padre) {
	    Categoria nuevoPadre = clonarCategoriaSinRelaciones(padre);

	    List<Categoria> nuevosHijos = padre.getSubCategorias().stream()
	        .map(hijo -> {
	            Categoria nuevoHijo = clonarCategoriaSinRelaciones(hijo);
	            Categoria padreRef = new Categoria();
	            padreRef.setId(padre.getId());
	            nuevoHijo.setObjPadre(padreRef);
	            return nuevoHijo;
	        })
	        .toList();

	    nuevoPadre.setSubCategorias(nuevosHijos);
	    return nuevoPadre;
	}

	private Categoria clonarCategoriaSinRelaciones(Categoria original) {
	    Categoria clon = new Categoria();
	    clon.setId(original.getId());
	    clon.setNombre(original.getNombre());
	    clon.setDescripcion(original.getDescripcion());
	    clon.setEstado(original.isEstado());
	    clon.setSlug(original.getSlug());
	    return clon;
	}

}
