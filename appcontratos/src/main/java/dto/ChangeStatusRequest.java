package dto;

import java.time.LocalDateTime;

import com.surrender.model.Vendedor;

public class ChangeStatusRequest {
	private int id;
	private boolean estado;
	private String estadoString;
	private Vendedor objVendedor;
	private LocalDateTime fechaActualizacion;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public boolean isEstado() {
		return estado;
	}
	public void setEstado(boolean estado) {
		this.estado = estado;
	}
	public String getEstadoString() {
		return estadoString;
	}
	public void setEstadoString(String estadoString) {
		this.estadoString = estadoString;
	}
	public Vendedor getObjVendedor() {
		return objVendedor;
	}
	public void setObjVendedor(Vendedor objVendedor) {
		this.objVendedor = objVendedor;
	}
	public LocalDateTime getFechaActualizacion() {
		return fechaActualizacion;
	}
	public void setFechaActualizacion(LocalDateTime fechaActualizacion) {
		this.fechaActualizacion = fechaActualizacion;
	}
}
