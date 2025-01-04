package com.surrender.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblDetalleContrato")
public class DetalleContrato {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private float cantidad;
	
	@Column(nullable = false)
	private String descripcion;
	
	@Column(nullable = false)
	private float precio;
	
	@Column(nullable = false)
	private float precioTotal;
	
	@ManyToOne
	@JoinColumn(name = "id_plantilla", nullable = true)
	private Plantilla objPlantilla;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="id_contrato", nullable = false)
	private Contrato objContrato;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public float getCantidad() {
		return cantidad;
	}

	public void setCantidad(float cantidad) {
		this.cantidad = cantidad;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public float getPrecio() {
		return precio;
	}

	public void setPrecio(float precio) {
		this.precio = precio;
	}

	public float getPrecioTotal() {
		return precioTotal;
	}

	public void setPrecioTotal(float precioTotal) {
		this.precioTotal = precioTotal;
	}

	public Contrato getObjContrato() {
		return objContrato;
	}

	public void setObjContrato(Contrato objContrato) {
		this.objContrato = objContrato;
	}
	
	public Plantilla getObjPlantilla() {
		return objPlantilla;
	}

	public void setObjPlantilla(Plantilla objPlantilla) {
		this.objPlantilla = objPlantilla;
	}

}
