package com.surrender.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="tblProductoImagen")
public class ProductoImagen {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;

	@Column(nullable = false)
	private String nombre;
	
	@Column(nullable = false)
	private String url;
	
	@JsonProperty(access = Access.WRITE_ONLY)
	@ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto objProducto;
	
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

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Producto getObjProducto() {
		return objProducto;
	}

	public void setObjProducto(Producto objProducto) {
		this.objProducto = objProducto;
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
