package com.surrender.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

import com.surrender.model.Reclamo;

public class UtilMethods {

	public static LocalDateTime obtenerFechaActualAmericaLima() {
		ZoneId zonaLima = ZoneId.of("America/Lima");
		ZonedDateTime zonedDateTime = ZonedDateTime.now(zonaLima);
		return zonedDateTime.toLocalDateTime();
	}
	
	public static String generarCodigoReclamo(Reclamo reclamo) {
		Integer anio = reclamo.getFechaReclamo().getYear();
		Integer id = reclamo.getId();
		String codigo = "RCL-".concat(anio.toString()).concat("-").concat(id.toString());
		
		return codigo;
	}
}
