package com.surrender.dto;

import java.util.ArrayList;
import java.util.List;

public class ArbolCategoriaDTO {

	private int id;
	private String nombre;
	private String slug;
	private Long cantidadProductos;
	private List<ArbolCategoriaDTO> subCategorias = new ArrayList<>();
	
	public ArbolCategoriaDTO(int id, String nombre, String slug, Long cantidadProductos) {
		this.id = id;
		this.nombre = nombre;
		this.slug = slug;
		this.cantidadProductos = cantidadProductos;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
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
	public Long getCantidadProductos() {
		return cantidadProductos;
	}
	public void setCantidadProductos(Long cantidadProductos) {
		this.cantidadProductos = cantidadProductos;
	}
	public List<ArbolCategoriaDTO> getSubCategorias() {
		return subCategorias;
	}
	public void setSubCategorias(List<ArbolCategoriaDTO> subCategorias) {
		this.subCategorias = subCategorias;
	}
	public void addSubCategoria(ArbolCategoriaDTO hijo) {
		this.cantidadProductos += hijo.getCantidadProductos();
		this.subCategorias.add(hijo);
	}
}
