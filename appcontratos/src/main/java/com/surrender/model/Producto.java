package com.surrender.model;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name="tblProducto")
public class Producto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false)
	private String nombre;
	
	@Column(nullable = false, unique = true)
	private String slug;
	
	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcion;
	
	@Column(nullable = false, columnDefinition = "TEXT")
	private String descripcionTecnica;
	
	@Column(nullable = false)
	private float precio;
	
	@Column(nullable = false)
	private int descuento;
	
	@Column(nullable = false)
	private float precioFinal;
	
	@Column(nullable = false)
	private int tiempoFabricacion;
	
	@Column(nullable = false)
	private boolean estado;
	
	@ManyToOne
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@JoinColumn(name = "id_vendedor_actualizacion", nullable = true)
	private Vendedor objVendedorActualizacion;
	
	@Column(nullable = true)
	private LocalDateTime fechaActualizacion;
	
	@OneToMany(mappedBy = "objProducto", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ProductoImagen> imagenes;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "tbl_producto_material", joinColumns = @JoinColumn(name="id_producto", referencedColumnName = "id"), 
				inverseJoinColumns = @JoinColumn(name = "id_material", referencedColumnName = "id"))
	private List<Material> materiales;
	
	@ManyToOne
    @JoinColumn(name = "id_detalle_material_defecto")
    private DetalleMaterial objDetalleMaterialDefecto;
	
	@ManyToOne
    @JoinColumn(name = "id_categoria")
    private Categoria objCategoria;
	
	@ManyToOne
    @JoinColumn(nullable = true, name = "id_plantilla")
    private Plantilla objPlantilla;

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
	
	public String getSlug() {
		return slug;
	}

	public void setSlug(String slug) {
		this.slug = slug;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getDescripcionTecnica() {
		return descripcionTecnica;
	}

	public void setDescripcionTecnica(String descripcionTecnica) {
		this.descripcionTecnica = descripcionTecnica;
	}

	public float getPrecio() {
		return precio;
	}

	public void setPrecio(float precio) {
		this.precio = precio;
	}

	public int getDescuento() {
		return descuento;
	}

	public void setDescuento(int descuento) {
		this.descuento = descuento;
	}

	public float getPrecioFinal() {
		return precioFinal;
	}

	public void setPrecioFinal(float precioFinal) {
		this.precioFinal = precioFinal;
	}

	public int getTiempoFabricacion() {
		return tiempoFabricacion;
	}

	public void setTiempoFabricacion(int tiempoFabricacion) {
		this.tiempoFabricacion = tiempoFabricacion;
	}

	public boolean isEstado() {
		return estado;
	}

	public void setEstado(boolean estado) {
		this.estado = estado;
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

	public List<ProductoImagen> getImagenes() {
		return imagenes;
	}

	public void setImagenes(List<ProductoImagen> imagenes) {
		this.imagenes = imagenes;
	}

	public List<Material> getMateriales() {
		return materiales;
	}

	public void setMateriales(List<Material> materiales) {
		this.materiales = materiales;
	}

	public DetalleMaterial getObjDetalleMaterialDefecto() {
		return objDetalleMaterialDefecto;
	}

	public void setObjDetalleMaterialDefecto(DetalleMaterial objDetalleMaterialDefecto) {
		this.objDetalleMaterialDefecto = objDetalleMaterialDefecto;
	}

	public Categoria getObjCategoria() {
		return objCategoria;
	}

	public void setObjCategoria(Categoria objCategoria) {
		this.objCategoria = objCategoria;
	}

	public Plantilla getObjPlantilla() {
		return objPlantilla;
	}

	public void setObjPlantilla(Plantilla objPlantilla) {
		this.objPlantilla = objPlantilla;
	}
}
