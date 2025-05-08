package com.surrender.service;

import java.util.List;

public interface ICRUD<T, ID> {

	List<T> listar() throws Exception;
	T listarPorId(ID id) throws Exception;
	
}
