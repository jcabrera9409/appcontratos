package com.surrender.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblResetToken")
public class ResetToken {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@Column(nullable = false, unique = true)
	private String token;
	
	@Column(nullable = false)
	private Integer idEntity;

	@Column(nullable = false)
	private LocalDateTime expiracion;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private ResetTokenType tokenType;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Integer getIdEntity() {
		return idEntity;
	}

	public void setIdEntity(Integer idEntity) {
		this.idEntity = idEntity;
	}

	public LocalDateTime getExpiracion() {
		return expiracion;
	}

	public void setExpiracion(LocalDateTime expiracion) {
		this.expiracion = expiracion;
	}
	
	public void setExpiracion(int minutos) {
		LocalDateTime hoy = LocalDateTime.now();
		LocalDateTime exp= hoy.plusMinutes(minutos);
		this.expiracion = exp;
	}

	public ResetTokenType getTokenType() {
		return tokenType;
	}

	public void setTokenType(ResetTokenType tokenType) {
		this.tokenType = tokenType;
	}
	
	public boolean isExpired() {
		return LocalDateTime.now().isAfter(this.expiracion);
	}
	
	
}
