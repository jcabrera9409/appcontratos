package com.surrender.configuration;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.surrender.model.Menu;
import com.surrender.model.Rol;
import com.surrender.model.Vendedor;
import com.surrender.repo.IMenuRepo;
import com.surrender.repo.IRolRepo;
import com.surrender.repo.IVendedorRepo;

@Component
public class DataInitializer implements CommandLineRunner {

	@Autowired
	private DataInitializerProperties properties;
	
	@Autowired
	private IMenuRepo repoMenu;
	
	@Autowired
	private IRolRepo repoRol;
	
	@Autowired
	private IVendedorRepo repoVendedor;	
	
	@Override
	public void run(String... args) throws Exception {
		inicializarRoles();
		inicializarMenus();
		inicializarVendedores();
	}
	
	private void inicializarVendedores() {
		for(Vendedor vendedor: properties.getVendedores()) {
			for(Rol rolMenu : vendedor.getRoles()) {
				for(Rol objRol : properties.getRoles()) {
					if(rolMenu.getNombre().equalsIgnoreCase(objRol.getNombre())) {
						rolMenu.setId(objRol.getId());
						break;
					}
				}
			}
			Optional<Vendedor> busqueda = repoVendedor.findByCorreo(vendedor.getCorreo());
			if(!busqueda.isPresent()) {
				Vendedor objNuevo = repoVendedor.save(vendedor);
				vendedor.setId(objNuevo.getId());
			} else {
				vendedor.setId(busqueda.get().getId());
				repoVendedor.save(vendedor);
			}
		}
	}

	private void inicializarMenus() {
		for(Menu menu : properties.getMenus()) {
			for(Rol rolMenu : menu.getRoles()) {
				for(Rol objRol : properties.getRoles()) {
					if(rolMenu.getNombre().equalsIgnoreCase(objRol.getNombre())) {
						rolMenu.setId(objRol.getId());
						break;
					}
				}
			}
			
			Optional<Menu> busqueda = repoMenu.findByNombre(menu.getNombre());
			if(!busqueda.isPresent()) {
				Menu objNuevo = repoMenu.save(menu);
				menu.setId(objNuevo.getId());
			} else {
				menu.setId(busqueda.get().getId());
				repoMenu.save(menu);
			}
		}
	}
	
	private void inicializarRoles() {
		for(Rol rol: properties.getRoles()) {
			Optional<Rol> busqueda = repoRol.findByNombre(rol.getNombre());
			if(!busqueda.isPresent()) {
				Rol objNuevo = repoRol.save(rol);
				rol.setId(objNuevo.getId());
			} else {
				rol.setId(busqueda.get().getId());
			}
		}
	}
	
}
