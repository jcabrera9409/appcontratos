import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../_service/menu.service';
import { Menu } from '../../_model/menu';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { LoginService } from '../../_service/login.service';
import { UtilMethods } from '../../util/util';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatListModule, RouterModule, MatMenuModule, MatDividerModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  menus: Menu[];
  usuarioNombre: String = "";

  constructor(
    private changeDetectorRef: ChangeDetectorRef, 
    private media: MediaMatcher,
    private menuService: MenuService,
    private loginService: LoginService,
    private router: Router) {
      this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
      this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit(): void {
    
    let token = UtilMethods.getJwtToken();
    if(token != null && token != "" && token != undefined) {
      this.cargarDatos(token);
    }
    else {
      this.router.navigate(['login']);
    }
  }

  cerrarSesion() {
    this.loginService.cerrarSesion();
  }

  cargarDatos(token) {
    if(this.menus == null || this.menus.length == 0) {
      this.cargarMenus(token);
    }

    if(this.usuarioNombre == undefined || this.usuarioNombre == "") {
      this.cargarNombreUsuario(token);
    }

    this.menuService.getMenuCambio().subscribe(data => {
      this.menus = data;
    });

  }

  cargarMenus(token) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    let correo = decodedToken.sub;
    
    this.menuService.listarPorCorreo(correo).subscribe(data => {
      this.menuService.setMenuCambio(data);
    });
  }

  cargarNombreUsuario(token) {
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    this.usuarioNombre = decodedToken.name;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
