package com.surrender.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Plantilla;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IPlantillaRepo;
import com.surrender.repo.IVendedorRepo;
import com.surrender.service.IPlantillaService;

import dto.ReportePlantillaIngresosDTO;

@Service
public class PlantillaServiceImpl extends CRUDImpl<Plantilla, Integer> implements IPlantillaService {

	@Autowired
	private IPlantillaRepo repo = null;
	
	@Autowired
	private IVendedorRepo repoVendedor = null;
	
	@Override
	protected IGenericRepo<Plantilla, Integer> getRepo() {
		return repo;
	}
	
	@Override
	public Plantilla registrar(Plantilla plantilla) {
		if(!plantilla.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			plantilla.setObjVendedorActualizacion(repoVendedor.findByCorreo(plantilla.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(plantilla);
	}
	
	@Override
	public Plantilla modificar(Plantilla plantilla) {
		if(!plantilla.getObjVendedorActualizacion().getCorreo().equalsIgnoreCase(StringUtils.EMPTY)) {
			plantilla.setObjVendedorActualizacion(repoVendedor.findByCorreo(plantilla.getObjVendedorActualizacion().getCorreo()).get());
		}
		return getRepo().save(plantilla);
	}
	
	@Override
	public int actualizarEstadoPorId(Integer id, boolean estado, String correoVendedorActualizacion, LocalDateTime fechaActualizacion) {
		int idVendedor = 0;
		if(!correoVendedorActualizacion.equalsIgnoreCase(StringUtils.EMPTY)) {
			idVendedor = repoVendedor.findByCorreo(correoVendedorActualizacion).get().getId();
		}
		return repo.updateEstadoById(id, estado, idVendedor, fechaActualizacion);
	}

	@Override
	public List<Plantilla> listarPlantillasActivas() {
		return repo.findByEstadoTrue();
	}

	@Override
	public List<ReportePlantillaIngresosDTO> obtenerReporteIngresosPorPlantilla(LocalDate fechaInicio, LocalDate fechaFin) {
		return repo.obtenerReportePorPlantilla(fechaInicio, fechaFin);
	}

}
