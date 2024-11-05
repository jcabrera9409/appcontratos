package com.surrender.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tblRol")
public class Rol {

	@Id
	private Integer id;
	
	@Column(length = 50)
	private String nombre;
	
	@Column
	private String descripcion;
}
