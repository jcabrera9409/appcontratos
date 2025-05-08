package com.surrender.dto;

import com.surrender.model.DetalleMaterial;
import com.surrender.model.Material;
import com.surrender.model.Producto;

public class DetalleCarritoDTO {

	private Producto producto;
	private Material material;
	private DetalleMaterial detalleMaterial;
	private int cantidad;
	
	public Producto getProducto() {
		return producto;
	}
	public void setProducto(Producto producto) {
		this.producto = producto;
	}
	public Material getMaterial() {
		return material;
	}
	public void setMaterial(Material material) {
		this.material = material;
	}
	public DetalleMaterial getDetalleMaterial() {
		return detalleMaterial;
	}
	public void setDetalleMaterial(DetalleMaterial detalleMaterial) {
		this.detalleMaterial = detalleMaterial;
	}
	public int getCantidad() {
		return cantidad;
	}
	public void setCantidad(int cantidad) {
		this.cantidad = cantidad;
	}
}
