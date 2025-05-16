package com.surrender.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="tblReclamo")
public class Reclamo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private String codigo;
	
	@Column(nullable = false)
	private String nombre;
	
	@Column(nullable = false)
	private String primerApellido;
	
	@Column(nullable = false)
	private String segundoApellido;
	
	@Column(nullable = false)
	private String tipoDocumento;
	
	@Column(nullable = false)
	private String numeroDocumento;
	
	@Column(nullable = false)
	private String celular;
	
	@Column(nullable = false)
	private String direccion;
	
	@Column(nullable = false)
	private String correo;
	
	@Column(nullable = false)
	private boolean esMenorEdad;
	
	@Column(nullable = false)
	private String nombreTutor;
	
	@Column(nullable = false)
	private String correoTutor;
	
	@Column(nullable = false)
	private String tipoDocumentoTutor;
	
	@Column(nullable = false)
	private String numeroDocumentoTutor;
	
	@Column(nullable = false)
	private String tipoReclamo;
	
	@Column(nullable = false)
	private String tipoConsumo;
	
	@Column(nullable = false)
	private String codigoContrato;
	
	@Column(nullable = false)
	private LocalDateTime fechaReclamo;
	
	@Column(nullable = false)
	private float montoReclamado;
	
	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcion;
	
	@Column(nullable = false, columnDefinition = "TEXT")
	private String detalleReclamo;
	
	@Column(nullable = false, columnDefinition = "TEXT")
	private String pedidoCliente;
	
	@Column(nullable = false)
	private String estado;
	
	@ManyToOne
	@JoinColumn(name = "id_distrito")
	private Distrito distrito;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getPrimerApellido() {
		return primerApellido;
	}

	public void setPrimerApellido(String primerApellido) {
		this.primerApellido = primerApellido;
	}

	public String getSegundoApellido() {
		return segundoApellido;
	}

	public void setSegundoApellido(String segundoApellido) {
		this.segundoApellido = segundoApellido;
	}

	public String getTipoDocumento() {
		return tipoDocumento;
	}

	public void setTipoDocumento(String tipoDocumento) {
		this.tipoDocumento = tipoDocumento;
	}

	public String getNumeroDocumento() {
		return numeroDocumento;
	}

	public void setNumeroDocumento(String numeroDocumento) {
		this.numeroDocumento = numeroDocumento;
	}

	public String getCelular() {
		return celular;
	}

	public void setCelular(String celular) {
		this.celular = celular;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public boolean isEsMenorEdad() {
		return esMenorEdad;
	}

	public void setEsMenorEdad(boolean esMenorEdad) {
		this.esMenorEdad = esMenorEdad;
	}

	public String getNombreTutor() {
		return nombreTutor;
	}

	public void setNombreTutor(String nombreTutor) {
		this.nombreTutor = nombreTutor;
	}

	public String getCorreoTutor() {
		return correoTutor;
	}

	public void setCorreoTutor(String correoTutor) {
		this.correoTutor = correoTutor;
	}

	public String getTipoDocumentoTutor() {
		return tipoDocumentoTutor;
	}

	public void setTipoDocumentoTutor(String tipoDocumentoTutor) {
		this.tipoDocumentoTutor = tipoDocumentoTutor;
	}

	public String getNumeroDocumentoTutor() {
		return numeroDocumentoTutor;
	}

	public void setNumeroDocumentoTutor(String numeroDocumentoTutor) {
		this.numeroDocumentoTutor = numeroDocumentoTutor;
	}

	public String getTipoReclamo() {
		return tipoReclamo;
	}

	public void setTipoReclamo(String tipoReclamo) {
		this.tipoReclamo = tipoReclamo;
	}

	public String getTipoConsumo() {
		return tipoConsumo;
	}

	public void setTipoConsumo(String tipoConsumo) {
		this.tipoConsumo = tipoConsumo;
	}

	public String getCodigoContrato() {
		return codigoContrato;
	}

	public void setCodigoContrato(String codigoContrato) {
		this.codigoContrato = codigoContrato;
	}

	public LocalDateTime getFechaReclamo() {
		return fechaReclamo;
	}

	public void setFechaReclamo(LocalDateTime fechaReclamo) {
		this.fechaReclamo = fechaReclamo;
	}

	public float getMontoReclamado() {
		return montoReclamado;
	}

	public void setMontoReclamado(float montoReclamado) {
		this.montoReclamado = montoReclamado;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getDetalleReclamo() {
		return detalleReclamo;
	}

	public void setDetalleReclamo(String detalleReclamo) {
		this.detalleReclamo = detalleReclamo;
	}

	public String getPedidoCliente() {
		return pedidoCliente;
	}

	public void setPedidoCliente(String pedidoCliente) {
		this.pedidoCliente = pedidoCliente;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}

	public Distrito getDistrito() {
		return distrito;
	}

	public void setDistrito(Distrito distrito) {
		this.distrito = distrito;
	}
}
