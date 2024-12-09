package com.surrender.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.surrender.repo.IVendedorRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

	@Autowired
	private IVendedorRepo repo;

	@Override
	public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
		return repo.findByCorreo(correo)
				.orElseThrow(() -> new UsernameNotFoundException("Correo no encontrado"));
	}
	
}
