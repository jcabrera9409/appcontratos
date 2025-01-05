package com.surrender.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

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

@SuppressWarnings("serial")
@Entity
@Table(name = "tblVendedor")
public class Vendedor implements UserDetails {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false, length = 200)
	private String nombres;
	
	@Column(nullable = false, length = 250)
	private String correo;
	
	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@Column(nullable = false)
	private String password;
	
	@Column(nullable = false)
	private boolean estado;
	
	@ManyToMany(fetch = FetchType.EAGER)
	@JoinTable(name = "tbl_vendedor_rol", joinColumns = @JoinColumn(name = "id_vendedor", referencedColumnName = "id"),
				inverseJoinColumns = @JoinColumn(name = "id_rol", referencedColumnName = "id"))
	private List<Rol> roles;
	
	@JsonIgnore
	@OneToMany(mappedBy = "objVendedor")
    private List<Token> tokens;
	
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
	public String getNombres() {
		return nombres;
	}
	public void setNombres(String nombres) {
		this.nombres = nombres;
	}
	public String getCorreo() {
		return correo;
	}
	public void setCorreo(String correo) {
		this.correo = correo;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public boolean isEstado() {
		return estado;
	}
	public void setEstado(boolean estado) {
		this.estado = estado;
	}
	public List<Rol> getRoles() {
		return roles;
	}
	public void setRoles(List<Rol> roles) {
		this.roles = roles;
	}
	public List<Token> getTokens() {
		return tokens;
	}
	public void setTokens(List<Token> tokens) {
		this.tokens = tokens;
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
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		List<GrantedAuthority> rolesAuth = new ArrayList<>();
		this.roles.forEach(rol -> {
			rolesAuth.add(new SimpleGrantedAuthority(rol.getNombre()));
		});
		return rolesAuth;
	}
	@Override
	public String getUsername() {
		return this.correo;
	}
	
	
}
