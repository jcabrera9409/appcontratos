package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.surrender.model.Menu;
import com.surrender.repo.IGenericRepo;
import com.surrender.repo.IMenuRepo;
import com.surrender.service.IMenuService;

@Service
public class MenuServiceImpl extends CRUDImpl<Menu, Integer> implements IMenuService {

	@Autowired
	private IMenuRepo repo = null;
	
	@Override
	protected IGenericRepo<Menu, Integer> getRepo() {
		return repo;
	}

}
