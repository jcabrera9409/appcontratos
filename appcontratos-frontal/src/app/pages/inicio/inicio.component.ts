import { Component, OnInit } from '@angular/core';
import { MenuService } from '../../_service/menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { VendedorService } from '../../_service/vendedor.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit{

  usuario: String
  correo: String

  constructor(
    private menuService: MenuService,
    private vendedorService: VendedorService
  ) {
  }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    let token = sessionStorage.getItem(environment.TOKEN_NAME);
    const decodedToken = helper.decodeToken(token);
    this.correo = decodedToken.sub;
    this.usuario = decodedToken.name;

    this.menuService.listarPorCorreo(this.correo).subscribe(data => {
      this.menuService.setMenuCambio(data);
    });

    this.vendedorService.setUsuarioNombreCambio(this.usuario);
  }
}
