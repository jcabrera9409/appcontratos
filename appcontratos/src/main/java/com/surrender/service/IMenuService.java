package com.surrender.service;

import java.util.List;

import com.surrender.model.Menu;

public interface IMenuService extends ICRUD<Menu, Integer> {

	List<Menu> listarMenusByVendedorCorreo(String correo);
}
