package com.surrender.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class UtilMethods {

	public static LocalDateTime obtenerFechaActualAmericaLima() {
		ZoneId zonaLima = ZoneId.of("America/Lima");
		ZonedDateTime zonedDateTime = ZonedDateTime.now(zonaLima);
		return zonedDateTime.toLocalDateTime();
	}
}
