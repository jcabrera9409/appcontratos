package com.surrender.model;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblContrato")
public class Contrato {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@ManyToOne
	@JoinColumn(name = "id_cliente", nullable = false)
	private Cliente objCliente;
	
	@Column(nullable = false, length = 15)
	private String telefono;
	
	@Column(nullable = false, length = 200)
	private String correo;
	
	@Column(nullable = false)
	private String direccionEntrega;
	
	@Column(nullable = false)
	private String referencia;
	
	@Column(nullable = false)
	private LocalDateTime fechaContrato;
	
	@Column(nullable = false)
	private LocalDateTime fechaEntrega;
	
	@Column(nullable = false)
	private Float movilidad;
	
	@Column(nullable = false)
	private Float aCuenta;
	
	@Column(nullable = false, length = 10)
	private String tipoAbono;
	
	@Column(nullable = false)
	private Float recargo;
	
	@Column(nullable = false)
	private Float saldo;
	
	@Column(nullable = false)
	private Float total;
	
	@ManyToOne
	@JoinColumn(name = "id_vendedor", nullable = false)
	private Vendedor objVendedor;
	
	@Column(nullable = false, length = 10)
	private String estado;
	
	@OneToMany(mappedBy = "objContrato", cascade = {CascadeType.ALL}, orphanRemoval = true)
	private List<DetalleContrato> detalleContrato;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Cliente getObjCliente() {
		return objCliente;
	}
	public void setObjCliente(Cliente objCliente) {
		this.objCliente = objCliente;
	}
	public String getTelefono() {
		return telefono;
	}
	public void setTelefono(String telefono) {
		this.telefono = telefono;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	public String getDireccionEntrega() {
		return direccionEntrega;
	}
	public void setDireccionEntrega(String direccionEntrega) {
		this.direccionEntrega = direccionEntrega;
	}
	public String getReferencia() {
		return referencia;
	}
	public void setReferencia(String referencia) {
		this.referencia = referencia;
	}
	public LocalDateTime getFechaContrato() {
		return fechaContrato;
	}
	public void setFechaContrato(LocalDateTime fechaContrato) {
		this.fechaContrato = fechaContrato;
	}
	public LocalDateTime getFechaEntrega() {
		return fechaEntrega;
	}
	public void setFechaEntrega(LocalDateTime fechaEntrega) {
		this.fechaEntrega = fechaEntrega;
	}
	public Float getMovilidad() {
		return movilidad;
	}
	public void setMovilidad(Float movilidad) {
		this.movilidad = movilidad;
	}
	public Float getaCuenta() {
		return aCuenta;
	}
	public void setaCuenta(Float aCuenta) {
		this.aCuenta = aCuenta;
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
	public Float getSaldo() {
		return saldo;
	}
	public void setSaldo(Float saldo) {
		this.saldo = saldo;
	}
	public Vendedor getObjVendedor() {
		return objVendedor;
	}
	public void setObjVendedor(Vendedor objVendedor) {
		this.objVendedor = objVendedor;
	}
	public Float getTotal() {
		return total;
	}
	public void setTotal(Float total) {
		this.total = total;
	}
	public String getEstado() {
		return estado;
	}
	public void setEstado(String estado) {
		this.estado = estado;
	}
	public List<DetalleContrato> getDetalleContrato() {
		return detalleContrato;
	}
	public void setDetalleContrato(List<DetalleContrato> detalleContrato) {
		this.detalleContrato = detalleContrato;
	}
	
	
}
