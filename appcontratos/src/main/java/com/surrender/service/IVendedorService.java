package com.surrender.service;

import java.util.Optional;

import com.surrender.model.Vendedor;

public interface IVendedorService extends ICRUD<Vendedor, Integer> {
	Optional<Vendedor> listarPorCorreo(String correo);
}
