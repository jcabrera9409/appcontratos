import { Routes } from '@angular/router';
import { ConocenosComponent } from './pages/conocenos/conocenos.component';
import { TiendaComponent } from './pages/tienda/tienda.component';
import { ProductComponent } from './pages/product/product.component';
import { CarritoComponent } from './pages/carrito/carrito.component';
import { FinalizarContratoComponent } from './pages/finalizar-contrato/finalizar-contrato.component';
import { PrivacityPolicyComponent } from './pages/privacity-policy/privacity-policy.component';
import { DiscriminationPolicyComponent } from './pages/discrimination-policy/discrimination-policy.component';
import { TermsAndConditionsComponent } from './pages/terms-and-conditions/terms-and-conditions.component';

export const routes: Routes = [
    { path: '', redirectTo: 'conocenos', pathMatch: 'full' },
    { path: 'conocenos', component: ConocenosComponent },
    { path: 'tienda', component: TiendaComponent },
    { path: 'tienda/:categoria', component: TiendaComponent },
    { path: 'producto/:slug', component: ProductComponent },
    { path: 'carrito', component: CarritoComponent },
    { path: 'finalizar', component: FinalizarContratoComponent },
    { path: 'politica-privacidad', component: PrivacityPolicyComponent },
    { path: 'politica-de-no-discriminacion', component: DiscriminationPolicyComponent },
    { path: 'terminos-y-condiciones', component: TermsAndConditionsComponent },
];
