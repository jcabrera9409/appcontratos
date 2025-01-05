import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { pagesRoutes } from './pages/pages.routes';
import { Not404Component } from './pages/not404/not404.component';
import { RestablecerComponent } from './pages/login/restablecer/restablecer.component';
import { Not403Component } from './pages/not403/not403.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'restablecer/:token', component: RestablecerComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'pages', component: LayoutComponent, children: pagesRoutes },
    { path: 'not-404', component: Not404Component },
    { path: 'not-403', component: Not403Component},
    { path: '**', redirectTo: '/not-404' }
];
