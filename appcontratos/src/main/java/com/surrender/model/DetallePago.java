package com.surrender.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblDetallePago")
public class DetallePago {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = true)
	private LocalDateTime fechaPago;
	
	@Column(nullable = false)
	private String comentario;
	
	@Column(nullable = false, length = 10)
	private String tipoAbono;
	
	@Column(nullable = false)
	private Float recargo;
	
	@Column(nullable = false)
	private float pago;
	
	@Column(nullable = false)
	private float total;
	
	@Column(nullable = false)
	private String comprobante;
	
	@Column(nullable = false)
	private boolean estado;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="id_contrato", nullable = false)
	private Contrato objContrato;
	
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
	
	public LocalDateTime getFechaPago() {
		return fechaPago;
	}

	public void setFechaPago(LocalDateTime fechaPago) {
		this.fechaPago = fechaPago;
	}

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public float getPago() {
		return pago;
	}

	public String getTipoAbono() {
		return tipoAbono;
	}

	public void setTipoAbono(String tipoAbono) {
		this.tipoAbono = tipoAbono;
	}

	public Float getRecargo() {
		return recargo;
	}

	public void setRecargo(Float recargo) {
		this.recargo = recargo;
	}

	public float getTotal() {
		return total;
	}

	public void setTotal(float total) {
		this.total = total;
	}

	public void setPago(float pago) {
		this.pago = pago;
	}

	public String getComprobante() {
		return comprobante;
	}

	public void setComprobante(String comprobante) {
		this.comprobante = comprobante;
	}

	public boolean isEstado() {
		return estado;
	}

	public void setEstado(boolean estado) {
		this.estado = estado;
	}

	public Contrato getObjContrato() {
		return objContrato;
	}

	public void setObjContrato(Contrato objContrato) {
		this.objContrato = objContrato;
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
