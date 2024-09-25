import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { MenuLayoutComponent } from './menu-layout/menu-layout.component';
import { authGuard } from './Guards/auth.guard';
import { InvitacionesComponent } from './invitaciones/invitaciones.component';
import { EventoComponent } from './evento/evento.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: '',
      component: MenuLayoutComponent, // El componente con el navbar
      canActivate: [authGuard], // Solo accesible si está autenticado
      children: [
        // Aquí puedes agregar otras rutas que estén dentro del layout
        { path: 'invitaciones', component: InvitacionesComponent }, // Ejemplo
        { path: 'evento', component: EventoComponent },     // Ejemplo
        { path: '', redirectTo: '/invitaciones', pathMatch: 'full' } // Redirigir a la ruta por defecto
      ]
    },
    { path: '**', redirectTo: 'login' } // Redirigir a login si no existe la ruta
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }