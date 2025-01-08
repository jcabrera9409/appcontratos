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
@Table(name = "tblDetalleComprobante")
public class DetalleComprobante {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private String comentario;
	
	@Column(nullable = false)
	private String google_zip_id;
	
	@Column(nullable = false)
	private String google_pdf_id;
	
	@Column(nullable = false)
	private LocalDateTime fechaCreacion;
	
	@JsonIgnore
	@ManyToOne
	@JoinColumn(name="id_comprobante", nullable = false)
	private Comprobante objComprobante;
	
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

	public String getComentario() {
		return comentario;
	}

	public void setComentario(String comentario) {
		this.comentario = comentario;
	}

	public String getGoogle_zip_id() {
		return google_zip_id;
	}

	public void setGoogle_zip_id(String google_zip_id) {
		this.google_zip_id = google_zip_id;
	}

	public String getGoogle_pdf_id() {
		return google_pdf_id;
	}

	public void setGoogle_pdf_id(String google_pdf_id) {
		this.google_pdf_id = google_pdf_id;
	}

	public LocalDateTime getFechaCreacion() {
		return fechaCreacion;
	}

	public void setFechaCreacion(LocalDateTime fechaCreacion) {
		this.fechaCreacion = fechaCreacion;
	}

	public Comprobante getObjComprobante() {
		return objComprobante;
	}

	public void setObjComprobante(Comprobante objComprobante) {
		this.objComprobante = objComprobante;
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
