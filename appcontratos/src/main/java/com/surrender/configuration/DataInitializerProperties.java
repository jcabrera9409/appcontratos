package com.surrender.configuration;

import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.surrender.model.Menu;
import com.surrender.model.Rol;
import com.surrender.model.Vendedor;

@Configuration
@ConfigurationProperties(prefix = "data-initializer")
public class DataInitializerProperties {

	private List<Rol> roles;
	private List<Menu> menus;
	private List<Vendedor> vendedores;
	
	public List<Rol> getRoles() {
		return roles;
	}
	public void setRoles(List<Rol> roles) {
		this.roles = roles;
	}
	public List<Menu> getMenus() {
		return menus;
	}
	public void setMenus(List<Menu> menus) {
		this.menus = menus;
	}
	public List<Vendedor> getVendedores() {
		return vendedores;
	}
	public void setVendedores(List<Vendedor> vendedores) {
		this.vendedores = vendedores;
	}
}
