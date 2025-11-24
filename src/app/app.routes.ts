import { Routes } from '@angular/router';

export const routes: Routes = [
  // 1. Redirección inicial: Al entrar a la app, ir al Login
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // 2. Ruta del Login (Nueva)
  {
    path: 'login',
    loadComponent: () => import('./presentation/auth/login-page/login-page.page').then( m => m.LoginPagePage)
  },

  // 3. Ruta de Registro (Existente)
  {
    path: 'registro',
    loadComponent: () => import('./auth/registro/registro.page').then( m => m.RegistroPage)
  },

  // 4. Ruta de Verificación OTP (Existente)
  {
    path: 'verificacion-otp',
    loadComponent: () => import('./auth/verificacion-otp/verificacion-otp.page').then( m => m.VerificacionOtpPage)
  },

  // 5. Ruta del Home (Existente - Protegida)
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
];