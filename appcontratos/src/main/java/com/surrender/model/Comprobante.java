package com.surrender.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblComprobante")
public class Comprobante {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private String notaContador;
	
	@Column(nullable = false)
	private boolean mostrarContrato;

	@OneToOne
	@JoinColumn(name = "id_contrato", nullable = false)
	private Contrato objContrato;
	
	@OneToMany(mappedBy = "objComprobante", cascade = {CascadeType.ALL}, orphanRemoval = true)
	private List<DetalleComprobante> detalleComprobante;
	
	@Column(nullable = false)
	private LocalDateTime fechaCreacion;
	
	@ManyToOne
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@JoinColumn(name = "id_vendedor_actualizacion", nullable = true)
	private Vendedor objVendedorActualizacion;
	
	@Column(nullable = true)
	private LocalDateTime fechaActualizacion;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getNotaContador() {
		return notaContador;
	}

	public void setNotaContador(String notaContador) {
		this.notaContador = notaContador;
	}

	public boolean isMostrarContrato() {
		return mostrarContrato;
	}

	public void setMostrarContrato(boolean mostrarContrato) {
		this.mostrarContrato = mostrarContrato;
	}

	public Contrato getObjContrato() {
		return objContrato;
	}

	public void setObjContrato(Contrato objContrato) {
		this.objContrato = objContrato;
	}

	public List<DetalleComprobante> getDetalleComprobante() {
		return detalleComprobante;
	}

	public void setDetalleComprobante(List<DetalleComprobante> detalleComprobante) {
		this.detalleComprobante = detalleComprobante;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Vendedor getObjVendedorActualizacion() {
		return objVendedorActualizacion;
	}

	public void setObjVendedorActualizacion(Vendedor objVendedorActualizacion) {
		this.objVendedorActualizacion = objVendedorActualizacion;
	}

	public LocalDateTime getFechaActualizacion() {
		return fechaActualizacion;
	}

	public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
		this.fechaActualizacion = fechaActualizacion;
	}	
}
