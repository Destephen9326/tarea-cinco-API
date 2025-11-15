import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'registro',
    
    loadComponent: () => import('./auth/registro/registro.page').then( m => m.RegistroPage)
  },
  
  {
    path: 'verificacion-otp',
    
    loadComponent: () => import('./auth/verificacion-otp/verificacion-otp.page').then( m => m.VerificacionOtpPage)
  },
  
  {
    path: '', 
    redirectTo: 'registro', 
    pathMatch: 'full',
  },
];