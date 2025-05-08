package com.surrender.dto;

import java.util.List;

public class CarritoDTO {

	private String codigo;
	private boolean esPersonaNatural;
	private String documentoCliente;
	private String nombreCliente;
	private String apellidoCliente;
	private String razonSocialCliente;
	private String telefonoCliente;
	private String emailCliente;
	private String direccionEntrega;
	private String referenciaEntrega;
	private String notasPedido;
	private float montoEnvio;
	private List<DetalleCarritoDTO> detalle;
	
	public String getCodigo() {
		return codigo;
	}
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	public boolean isEsPersonaNatural() {
		return esPersonaNatural;
	}
	public void setEsPersonaNatural(boolean esPersonaNatural) {
		this.esPersonaNatural = esPersonaNatural;
	}
	public String getDocumentoCliente() {
		return documentoCliente;
	}
	public void setDocumentoCliente(String documentoCliente) {
		this.documentoCliente = documentoCliente;
	}
	public String getNombreCliente() {
		return nombreCliente;
	}
	public void setNombreCliente(String nombreCliente) {
		this.nombreCliente = nombreCliente;
	}
	public String getApellidoCliente() {
		return apellidoCliente;
	}
	public void setApellidoCliente(String apellidoCliente) {
		this.apellidoCliente = apellidoCliente;
	}
	public String getRazonSocialCliente() {
		return razonSocialCliente;
	}
	public void setRazonSocialCliente(String razonSocialCliente) {
		this.razonSocialCliente = razonSocialCliente;
	}
	public String getTelefonoCliente() {
		return telefonoCliente;
	}
	public void setTelefonoCliente(String telefonoCliente) {
		this.telefonoCliente = telefonoCliente;
	}
	public String getEmailCliente() {
		return emailCliente;
	}
	public void setEmailCliente(String emailCliente) {
		this.emailCliente = emailCliente;
	}
	public String getDireccionEntrega() {
		return direccionEntrega;
	}
	public void setDireccionEntrega(String direccionEntrega) {
		this.direccionEntrega = direccionEntrega;
	}
	public String getReferenciaEntrega() {
		return referenciaEntrega;
	}
	public void setReferenciaEntrega(String referenciaEntrega) {
		this.referenciaEntrega = referenciaEntrega;
	}
	public String getNotasPedido() {
		return notasPedido;
	}
	public void setNotasPedido(String notasPedido) {
		this.notasPedido = notasPedido;
	}
	public float getMontoEnvio() {
		return montoEnvio;
	}
	public void setMontoEnvio(float montoEnvio) {
		this.montoEnvio = montoEnvio;
	}
	public List<DetalleCarritoDTO> getDetalle() {
		return detalle;
	}
	public void setDetalle(List<DetalleCarritoDTO> detalle) {
		this.detalle = detalle;
	}
}
