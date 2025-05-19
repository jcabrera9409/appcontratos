package com.surrender.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.DetalleMaterial;
import com.surrender.model.Material;
import com.surrender.repo.IDetalleMaterialRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IMaterialRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IMaterialService;

@Service
public class MaterialServiceImpl extends CRUDImpl<Material, Integer> implements IMaterialService {

	@Autowired
	private IMaterialRepo repoMaterial;
	
	@Autowired
	private IDetalleMaterialRepo repoDetalle;
	
	@Autowired
	private IVendedorRepo repoVendedor;
	
	@Override
	protected IGenericRepo<Material, Integer> getRepo() {
		return repoMaterial;
	}

	@Override
	public List<Material> listar() {
		return repoMaterial.findAllByOrderByNombreAsc();
	}
	
	@Override
	public Material registrar(Material obj) throws Exception {
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			obj.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repoMaterial.save(obj);
	}
	
	@Override
	public Material modificar(Material obj) throws Exception {
		Material original = repoMaterial.findById(obj.getId()).get();
				
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			original.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		original.setNombre(obj.getNombre());
		original.setDescripcion(obj.getDescripcion());
		original.setFechaActualizacion(obj.getFechaActualizacion());
		
		return repoMaterial.save(original);
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repoMaterial.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}

	@Override
	public DetalleMaterial registrarDetalle(DetalleMaterial obj) {
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			obj.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repoDetalle.save(obj);
	}

	@Override
	public DetalleMaterial modificarDetalle(DetalleMaterial obj) {
		DetalleMaterial original = repoDetalle.findById(obj.getId()).get();
		
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			original.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		original.setNombre(obj.getNombre());
		original.setDescripcion(obj.getDescripcion());
		original.setFechaActualizacion(obj.getFechaActualizacion());
		
		return repoDetalle.save(original);
	}

	@Override
	public int actualizarEstadoDetallePorId(Integer id, boolean estado, String correoVendedorActualizacion,
			LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repoDetalle.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}

}
