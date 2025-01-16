package com.surrender.service.impl;

import java.time.LocalDateTime;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Cliente;
import com.surrender.model.Contrato;
import com.surrender.model.DetallePago;
import com.surrender.repo.IClienteRepo;
import com.surrender.repo.IContratoRepo;
import com.surrender.repo.IDetallePagoRepo;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IContratoService;

import jakarta.transaction.Transactional;

@Service
public class ContratoServiceImpl extends CRUDImpl<Contrato, Integer> implements IContratoService {

	@Autowired
	private IContratoRepo repo;
	
	@Autowired
	private IClienteRepo repoCliente;
	
	@Autowired
	private IVendedorRepo repoVendedor;
	
	@Autowired
	private IDetallePagoRepo repoDetallePago;

	@Override
	protected IGenericRepo<Contrato, Integer> getRepo() {
		return repo;
	}

	@Transactional
	@Override
	public Contrato registrarContratoTransaccional(Contrato contrato) {
		if(contrato.getObjCliente().getId() <= 0) {
			Cliente cliente = repoCliente.findByDocumentoCliente(contrato.getObjCliente().getDocumentoCliente());
			if(cliente != null) {
				contrato.getObjCliente().setId(cliente.getId());
			}
			contrato.setObjCliente(repoCliente.save(contrato.getObjCliente()));
		}
		
		if(!contrato.getObjVendedor().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			contrato.setObjVendedor(repoVendedor.findByCorreo(contrato.getObjVendedor().getCorreo()).get());
		}
		
		contrato.getDetalleContrato().forEach(det -> det.setObjContrato(contrato));
		return repo.save(contrato); 
	}

	@Transactional
	@Override
	public Contrato modificarContratoTransaccional(Contrato contrato) {		
		if(!contrato.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			contrato.setObjVendedorActualizacion(repoVendedor.findByCorreo(contrato.getObjVendedorActualizacion().getCorreo()).get());
		}		
		contrato.getDetalleContrato().forEach(det -> det.setObjContrato(contrato));
		return repo.save(contrato);
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, String estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repo.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}

	@Override
	public Contrato listarPorCodigo(String codigo) {
		return repo.findByCodigo(codigo);
	}

	@Override
	public DetallePago registrarDetallePago(DetallePago detallePago) {
		int idVendedor = 0;
		if(!detallePago.getObjContrato().getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(detallePago.getObjContrato().getObjVendedorActualizacion().getCorreo()).get().getId();
			detallePago.setObjVendedorActualizacion(detallePago.getObjContrato().getObjVendedorActualizacion());
			detallePago.getObjVendedorActualizacion().setId(idVendedor);
		}
		return repoDetallePago.save(detallePago);
	}

	@Override
	public int actualizarEstadoDetallePagoPorId(Integer id, boolean estado, String correoVendedorActualizacion,
			LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repoDetallePago.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}

}
