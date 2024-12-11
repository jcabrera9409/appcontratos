import { Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';
import { ContratoComponent } from './contrato/contrato.component';
import { ContratoEdicionComponent } from './contrato/contrato-edicion/contrato-edicion.component';
import { InicioComponent } from './inicio/inicio.component';
import { authGuard } from '../_service/guard.service';
import { Not403Component } from './not403/not403.component';

export const pagesRoutes: Routes = [
    { path: 'contratos', component: ContratoComponent, canActivate: [authGuard] },
    { path: 'contratos/nuevo', component: ContratoEdicionComponent, canActivate: [authGuard] },
    { path: 'contratos/modificar', component: ContratoEdicionComponent, canActivate: [authGuard] },
    { path: 'clientes', component: ClienteComponent, canActivate: [authGuard] },
    { path: 'vendedores', component: ClienteComponent, canActivate: [authGuard] },
    { path: 'not-403', component: Not403Component},
    { path: '', component: InicioComponent}
];
