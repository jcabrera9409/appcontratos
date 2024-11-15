import { Routes } from '@angular/router';
import { ClienteComponent } from './pages/cliente/cliente.component';
import { ContratoComponent } from './pages/contrato/contrato.component';
import { ContratoEdicionComponent } from './pages/contrato/contrato-edicion/contrato-edicion.component';

export const routes: Routes = [
    { path: 'contratos', component: ContratoComponent },
    { path: 'contratos/nuevo', component: ContratoEdicionComponent },
    { path: 'contratos/modificar', component: ContratoEdicionComponent },
    { path: 'clientes', component: ClienteComponent },

    { path: '**', redirectTo: ''}
];
