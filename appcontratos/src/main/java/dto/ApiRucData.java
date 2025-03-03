package dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiRucData {

	private String ruc;
	private String nombre_o_razon_social;
	
	public String getRuc() {
		return ruc;
	}
	public String getNombre_o_razon_social() {
		return nombre_o_razon_social;
	}
	public void setRuc(String ruc) {
		this.ruc = ruc;
	}
	public void setNombre_o_razon_social(String nombre_o_razon_social) {
		this.nombre_o_razon_social = nombre_o_razon_social;
	}
}
