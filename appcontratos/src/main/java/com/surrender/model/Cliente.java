package com.surrender.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblCliente")
public class Cliente {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private Boolean esPersonaNatural;
	
	@Column(nullable = false, length = 200)
	private String nombreCliente;
	
	@Column(nullable = false, length = 200)
	private String apellidosCliente;
	
	@Column(nullable = false, length = 250)
	private String razonSocial;
	
	@Column(nullable = false, length = 25, unique = true)
	private String documentoCliente;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Boolean isEsPersonaNatural() {
		return esPersonaNatural;
	}
	public void setEsPersonaNatural(Boolean esPersonaNatural) {
		this.esPersonaNatural = esPersonaNatural;
	}
	public String getNombreCliente() {
		return nombreCliente;
	}
	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
	public String getApellidosCliente() {
		return apellidosCliente;
	}
	public void setApellidosCliente(String apellidosCliente) {
		this.apellidosCliente = apellidosCliente;
	}
	public String getDocumentoCliente() {
		return documentoCliente;
	}
	public void setDocumentoCliente(String documentoCliente) {
		this.documentoCliente = documentoCliente;
	}
	public String getRazonSocial() {
		return razonSocial;
	}
	public void setRazonSocial(String razonSocial) {
		this.razonSocial = razonSocial;
	}	
}
