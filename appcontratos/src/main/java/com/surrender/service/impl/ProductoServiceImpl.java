package com.surrender.service.impl;

import java.time.LocalDateTime;
import java.util.List;

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
import com.surrender.util.UtilMethods;

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
	public List<Producto> listar() {
		return repoProducto.findAllByOrderByNombreAsc();
	}
	
	@Override
	public Producto registrar(Producto obj) {
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			obj.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repoProducto.save(obj);
	}
	
	@Override
	public Producto modificar(Producto obj) {
		Producto original = repoProducto.findById(obj.getId()).get();
		
		if(!original.getNombre().equals(obj.getNombre())) {
			String slugBase = UtilMethods.generarSlugUnico(obj.getNombre(), null);
			List<String> slugsExistentes = repoProducto.findAllSlugLike(slugBase);
			slugBase = UtilMethods.generarSlugUnico(slugBase, slugsExistentes);
			
			original.setSlug(slugBase);
		}
		
		original.setNombre(obj.getNombre());
		original.setDescripcion(obj.getDescripcion());
		original.setDescripcionTecnica(obj.getDescripcionTecnica());
		original.setDescuento(obj.getDescuento());
		original.setFechaActualizacion(obj.getFechaActualizacion());
		original.setMateriales(obj.getMateriales());
		original.setObjCategoria(obj.getObjCategoria());
		original.setObjDetalleMaterialDefecto(obj.getObjDetalleMaterialDefecto());
		original.setPrecio(obj.getPrecio());
		original.setPrecioFinal(obj.getPrecioFinal());
		original.setTiempoFabricacion(obj.getTiempoFabricacion());
		
		if(!obj.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			original.setObjVendedorActualizacion(repoVendedor.findByCorreo(obj.getObjVendedorActualizacion().getCorreo()).get());
		}
		
		return repoProducto.save(original);
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
