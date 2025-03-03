package dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ApiDniData {
	private String numero;
	private String nombres;
	private String apellido_paterno;
	private String apellido_materno;
	
	public String getNumero() {
		return numero;
	}
	public String getNombres() {
		return nombres;
	}
	public String getApellido_paterno() {
		return apellido_paterno;
	}
	public String getApellido_materno() {
		return apellido_materno;
	}
	public void setNumero(String numero) {
		this.numero = numero;
	}
	public void setNombres(String nombres) {
		this.nombres = nombres;
	}
	public void setApellido_paterno(String apellido_paterno) {
		this.apellido_paterno = apellido_paterno;
	}
	public void setApellido_materno(String apellido_materno) {
		this.apellido_materno = apellido_materno;
	}
		
}
