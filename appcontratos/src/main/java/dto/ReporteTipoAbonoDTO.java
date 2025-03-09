package dto;

public class ReporteTipoAbonoDTO {
	private String tipoAbono;
    private Double totalIngresos;

    public ReporteTipoAbonoDTO(String tipoAbono, Double totalIngresos) {
        this.tipoAbono = tipoAbono;
        this.totalIngresos = totalIngresos;
    }

    public String getTipoAbono() { return tipoAbono; }
    public Double getTotalIngresos() { return totalIngresos; }
}
