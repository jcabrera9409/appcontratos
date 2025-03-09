package com.surrender.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.surrender.service.IContratoService;
import com.surrender.service.IPlantillaService;

import dto.ReporteContratosIngresosDTO;
import dto.ReportePlantillaIngresosDTO;
import dto.ReporteTipoAbonoDTO;

@RestController
@RequestMapping("/reportes")
@PreAuthorize("@authenticationService.tieneAcceso('reporte')")
public class ReporteController {

	@Autowired
	private IContratoService contratoService;
	
	@Autowired
	private IPlantillaService plantillaService;
	
	@GetMapping("/contratos-ingresos")
	public ResponseEntity<?> reporteContratosIngresos(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) throws Exception {
		List<ReporteContratosIngresosDTO> reporte = contratoService.obtenerReporteContratosIngresos(fechaInicio, fechaFin);
		if(reporte.size() == 0) {
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		
		return new ResponseEntity<List<ReporteContratosIngresosDTO>>(reporte, HttpStatus.OK);
	}
	
	@GetMapping("/tipo-abono")
	public ResponseEntity<?> obtenerReporteTipoAbono(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) throws Exception {
		List<ReporteTipoAbonoDTO> reporte = contratoService.obtenerReporteTipoAbono(fechaInicio, fechaFin);
		if(reporte.size() == 0) {
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		
		return new ResponseEntity<List<ReporteTipoAbonoDTO>>(reporte, HttpStatus.OK);
	}
	
	@GetMapping("/plantilla-ingresos")
	public ResponseEntity<?> reportePlantillaIngresos(@RequestParam LocalDate fechaInicio, @RequestParam LocalDate fechaFin) throws Exception {
		List<ReportePlantillaIngresosDTO> reporte = plantillaService.obtenerReporteIngresosPorPlantilla(fechaInicio, fechaFin);
		if(reporte.size() == 0) {
			return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
		}
		
		return new ResponseEntity<List<ReportePlantillaIngresosDTO>>(reporte, HttpStatus.OK);
	}
	
}
