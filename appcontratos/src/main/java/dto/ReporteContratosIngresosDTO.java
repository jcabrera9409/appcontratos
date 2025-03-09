package dto;

import java.time.LocalDate;

public interface ReporteContratosIngresosDTO {
	LocalDate getFechaContrato();
	Integer getNroContratos();
    Float getTotalIngresos();
}
