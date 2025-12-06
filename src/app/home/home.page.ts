import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, ToastController } from '@ionic/angular/standalone';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon],
})
export class HomePage {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async cerrarSesion() {
    try {
      await this.authService.cerrarSesion();
      await this.mostrarToast('Sesión cerrada correctamente', 'success');
      
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1000);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      await this.mostrarToast('Error al cerrar sesión. Por favor, intenta nuevamente.', 'danger');
    }
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }
}
