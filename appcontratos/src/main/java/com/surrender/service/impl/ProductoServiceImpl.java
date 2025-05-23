package com.surrender.service.impl;

import java.time.LocalDateTime;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Producto;
import com.surrender.model.ProductoImagen;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IProductoImagenRepo;
import com.surrender.repo.IProductoRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IProductoService;

@Service
public class ProductoServiceImpl extends CRUDImpl<Producto, Integer> implements IProductoService {

	@Autowired
	private IProductoRepo repoProducto;
	
	@Autowired 
	private IProductoImagenRepo repoImagen;
	
	@Autowired
	private IVendedorRepo repoVendedor;
	
	@Override
	protected IGenericRepo<Producto, Integer> getRepo() {
		return repoProducto;
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion,
			LocalDateTime fechaActualizacion) {
		return repoProducto.updateEstadoById(id, estado, id, fechaActualizacion);
	}

	@Override
	public ProductoImagen registrarImagen(ProductoImagen obj) throws Exception{
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			obj.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		return repoImagen.save(obj);
	}

	@Override
	public ProductoImagen modificarImagen(ProductoImagen obj) throws Exception{
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			obj.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		return repoImagen.save(obj);
	}

	@Override
	public void eliminarImagen(Integer id) throws Exception{
		repoProducto.deleteById(id);
	}

}
