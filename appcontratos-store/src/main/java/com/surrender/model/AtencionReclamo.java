package com.surrender.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="tblAtencionReclamo")
public class AtencionReclamo {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String respuesta;

    @Column(nullable = false)
    private LocalDateTime fechaAtencion;

    @Column(nullable = false)
    private String documentoAdjunto;
    
    @OneToOne
    @JoinColumn(name = "id_reclamo", nullable = false)
    private Reclamo reclamo;
    
    @ManyToOne
    @JoinColumn(name = "id_vendedor")
    private Vendedor vendedor;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getRespuesta() {
		return respuesta;
	}

	public void setRespuesta(String respuesta) {
		this.respuesta = respuesta;
	}

	public LocalDateTime getFechaAtencion() {
		return fechaAtencion;
	}

	public void setFechaAtencion(LocalDateTime fechaAtencion) {
		this.fechaAtencion = fechaAtencion;
	}

	public String getDocumentoAdjunto() {
		return documentoAdjunto;
	}

	public void setDocumentoAdjunto(String documentoAdjunto) {
		this.documentoAdjunto = documentoAdjunto;
	}

	public Reclamo getReclamo() {
		return reclamo;
	}

	public void setReclamo(Reclamo reclamo) {
		this.reclamo = reclamo;
	}

	public Vendedor getVendedor() {
		return vendedor;
	}

	public void setVendedor(Vendedor vendedor) {
		this.vendedor = vendedor;
	}
}
