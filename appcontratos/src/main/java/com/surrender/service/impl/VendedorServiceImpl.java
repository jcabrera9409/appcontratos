package com.surrender.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Vendedor;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IVendedorService;

@Service
public class VendedorServiceImpl extends CRUDImpl<Vendedor, Integer> implements IVendedorService {

	@Autowired
	private IVendedorRepo repo = null;
	
	@Override
	protected IGenericRepo<Vendedor, Integer> getRepo() {
		return repo;
	}

	@Override
	public Optional<Vendedor> listarPorCorreo(String correo) {
		return repo.findByCorreo(correo);
	}
	
	@Override
	public Vendedor registrar(Vendedor vendedor) throws Exception {
		if(!vendedor.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			vendedor.setObjVendedorActualizacion(repo.findByCorreo(vendedor.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(vendedor);
	}
	
	@Override
	public Vendedor modificar(Vendedor vendedor) throws Exception {
		if(!vendedor.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			vendedor.setObjVendedorActualizacion(repo.findByCorreo(vendedor.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(vendedor);
	}

	@Override
	public int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repo.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repo.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}
	
}
