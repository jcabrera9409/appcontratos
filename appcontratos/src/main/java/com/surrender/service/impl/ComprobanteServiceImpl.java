package com.surrender.service.impl;

import java.util.Optional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Comprobante;
import com.surrender.model.DetalleComprobante;
import com.surrender.repo.IComprobanteRepo;
import com.surrender.repo.IDetalleComprobanteRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IComprobanteService;

@Service
public class ComprobanteServiceImpl extends CRUDImpl<Comprobante, Integer> implements IComprobanteService {

	@Autowired
	private IComprobanteRepo repo;
	
	@Autowired
	private IVendedorRepo repoVendedor;
	
	@Autowired
	private IDetalleComprobanteRepo repoDetalle;
	
	@Override
	protected IGenericRepo<Comprobante, Integer> getRepo() {
		return repo;
	}

	@Override
	public Optional<Comprobante> buscarPorCodigoContrato(String codigo) {
		return repo.findByObjContratoCodigo(codigo);
	}
	
	@Override
	public Comprobante registrar(Comprobante c) {
		int idVendedor = 0;
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get().getId();
			c.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repo.save(c);
	}

	@Override
	public Comprobante modificar(Comprobante c) {
		int idVendedor = 0;
		if(!c.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(c.getObjVendedorActualizacion().getCorreo()).get().getId();
			c.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repo.save(c);
	}

	@Override
	public DetalleComprobante registrarDetalleComprobante(DetalleComprobante detalleComprobante) {
		int idVendedor = 0;
		if(!detalleComprobante.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(detalleComprobante.getObjVendedorActualizacion().getCorreo()).get().getId();
			detalleComprobante.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repoDetalle.save(detalleComprobante);
	}

	@Override
	public void eliminarDetalleComprobante(Integer id) {
		repoDetalle.deleteById(id);
	}

	@Override
	public Optional<DetalleComprobante> buscarDetalleComprobantePorId(Integer id) {
		return repoDetalle.findById(id);
	}

	@Override
	public void actualizarVecesEnviado(int id, int veces_enviado) {
		repoDetalle.updateVecesEnviado(id, veces_enviado);
	}
}
