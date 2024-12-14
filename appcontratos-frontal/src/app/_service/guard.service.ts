import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from './login.service';
import { MenuService } from './menu.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Menu } from '../_model/menu';
import { UtilMethods } from '../util/util';

export const authGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean => {
  const loginService = inject(LoginService);
  const menuService = inject(MenuService);
  const router = inject(Router);

  if (!loginService.estaLogueado()) {
    loginService.cerrarSesion();
    return false;
  }
  else {
    if(!UtilMethods.isTokenExpired()) {
      let url:String = state.url;
      const correo = UtilMethods.getFieldJwtToken('sub');

      return menuService.listarPorCorreo(correo).pipe(map((data: Menu[]) => {
        menuService.setMenuCambio(data);

        for (let m of data) {
          if(url.startsWith(String(m.url))) {
            return true;
          }
        }
        
        router.navigate(['/pages/not-403']);
        return false;

      }))

    } else {
      loginService.cerrarSesion();
      return false;
    }
  }

}