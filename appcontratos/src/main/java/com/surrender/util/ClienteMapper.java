package com.surrender.util;

import com.surrender.model.Cliente;

import dto.ApiDniData;
import dto.ApiRucData;

public class ClienteMapper {

	
	public static Cliente mapDesdeDni(ApiDniData data, String dni) {
		Cliente cliente = new Cliente();
		cliente.setId(0);
		cliente.setEsPersonaNatural(true);
		cliente.setNombreCliente(UtilMethods.capitalizeWords(data.getNombres()));
		cliente.setApellidosCliente(UtilMethods.capitalizeWords(data.getApellido_paterno() + " " + data.getApellido_materno()));
		cliente.setRazonSocial("");
		cliente.setDocumentoCliente(dni);
		
		return cliente;
	}
	
	public static Cliente mapDesdeRuc(ApiRucData data, String ruc) {
		Cliente cliente = new Cliente();
		cliente.setId(0);
		cliente.setEsPersonaNatural(false);
		cliente.setNombreCliente("");
		cliente.setApellidosCliente("");
		cliente.setRazonSocial(UtilMethods.capitalizeWords(data.getNombre_o_razon_social()));
		cliente.setDocumentoCliente(ruc);
		
		return cliente;
	}
}
