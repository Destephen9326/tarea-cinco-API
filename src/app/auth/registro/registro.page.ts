import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavController, ToastController, LoadingController } from '@ionic/angular';

import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonIcon } from "@ionic/angular/standalone";

import { passwordValidator, numericMinLengthValidator } from '../../shared/validators/custom.validators';
import { AuthService } from '../../shared/services/auth.service';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon
  ]
})
export class RegistroPage implements OnInit {

  public formularioRegistro!: FormGroup;
  public isLoading: boolean = false;
  public readonly CODIGO_PAIS_DEFAULT = '+504'; 

  constructor(
    private formBuilder: FormBuilder,
    private navCtrl: NavController, 
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.formularioRegistro = this.formBuilder.group({
      nombres: ['', [Validators.required]],
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, passwordValidator()]],
      numeroTelefono: ['', [Validators.required, numericMinLengthValidator(8)]],
    });
  }

  
  public async registrarUsuario(): Promise<void> {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      await this.mostrarToast('Por favor, completa todos los campos correctamente.', 'warning');
      return;
    }

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Procesando registro...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      
      const fullName = this.formularioRegistro.value.nombres.trim();
      const partes = fullName.split(' ');
      const names = partes[0];
      const surnames = partes.slice(1).join(' ') || '.'; 

  
      const numeroTelefonoFormateado = this.formatoNumeroTelefono(this.formularioRegistro.value.numeroTelefono);
      console.log('Número original:', this.formularioRegistro.value.numeroTelefono);
      console.log('Número formateado:', numeroTelefonoFormateado);

 
      const datosUsuario = {
        names: names,
        surnames: surnames,
        email: this.formularioRegistro.value.correoElectronico,
        password: this.formularioRegistro.value.contrasena,
        phoneNumber: numeroTelefonoFormateado,
        address: null,
        fcmToken: null
      };

     
      this.authService.setDatosRegistro(datosUsuario);
      
     
      console.log('Enviando OTP a:', numeroTelefonoFormateado);
      await this.authService.enviarTokenTelefono(numeroTelefonoFormateado);

      await loading.dismiss();
      this.isLoading = false;

      await this.mostrarToast('Código de verificación enviado. Revisa tu teléfono.', 'success');

      setTimeout(() => {
        this.navCtrl.navigateForward('/verificacion-otp');
      }, 1500);

    } catch (error: any) {
      await loading.dismiss();
      this.isLoading = false;
      console.error('Error en el registro:', error);
      
    
      let mensajeError = 'Ocurrió un error inesperado.';
      
      if (error?.message?.includes('parsing') || error?.name === 'HttpErrorResponse') {

        if (error?.status === 200 || error?.status === 201) {
          await this.mostrarToast('Código de verificación enviado. Revisa tu teléfono.', 'success');
          setTimeout(() => {
            this.navCtrl.navigateForward('/verificacion-otp');
          }, 1500);
          return;
        }
        mensajeError = 'Error al procesar la respuesta del servidor.';
      } else if (error?.error?.message) {
        mensajeError = error.error.message;
      } else if (error?.message) {
        mensajeError = error.message;
      } else if (error?.status === 0) {
        mensajeError = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      } else if (error?.status === 400) {
        mensajeError = 'Datos inválidos. Por favor, verifica la información ingresada.';
      } else if (error?.status === 409) {
        mensajeError = 'El correo o teléfono ya está registrado.';
      } else if (error?.status >= 500) {
        mensajeError = 'Error del servidor. Por favor, intenta más tarde.';
      }
      
      await this.mostrarToast(mensajeError, 'danger');
    }
  }

  
  irALogin() {
    this.navCtrl.navigateBack('/login');
  }

  /**
   * @param numero Número de teléfono ingresado por el usuario
   * @returns Número formateado con código de país (ej: +50432794682)
   */
  private formatoNumeroTelefono(numero: string): string {
    if (!numero) return '';
    
    // Eliminar espacios y caracteres especiales excepto + y números
    let numeroLimpio = numero.replace(/\s+/g, '').replace(/[^\d+]/g, '');
    
    // Si ya tiene código de país (empieza con +), retornarlo tal cual
    if (numeroLimpio.startsWith('+')) {
      return numeroLimpio;
    }
    
    // Si empieza con 0, eliminarlo (código local)
    if (numeroLimpio.startsWith('0')) {
      numeroLimpio = numeroLimpio.substring(1);
    }
    
    // Agregar código de país por defecto si no lo tiene
    return `${this.CODIGO_PAIS_DEFAULT}${numeroLimpio}`;
  }

  
  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  // --- GETTERS (Mantenidos del original para mostrar errores detallados) ---

  get nombresInvalido(): boolean {
    const control = this.formularioRegistro.get('nombres');
    return control ? control.invalid && control.touched : false;
  }

  get correoElectronicoInvalido(): boolean {
    const control = this.formularioRegistro.get('correoElectronico');
    return control ? control.invalid && control.touched : false;
  }

  get contrasenaInvalida(): boolean {
    const control = this.formularioRegistro.get('contrasena');
    return control ? control.invalid && control.touched : false;
  }

  get numeroTelefonoInvalido(): boolean {
    const control = this.formularioRegistro.get('numeroTelefono');
    return control ? control.invalid && control.touched : false;
  }

  get contrasenaErrores(): string | null {
    const errors = this.formularioRegistro.get('contrasena')?.errors;
    if (!errors) return null;
    if (errors['required']) return 'La contraseña es obligatoria.';
    if (errors['invalidPassword']) return 'Mín. 6 caracteres, 1 mayúscula, 1 número y 1 símbolo.';
    return null;
  }

  get numeroTelefonoErrores(): string | null {
    const control = this.formularioRegistro.get('numeroTelefono');
    const errors = control?.errors;
    if (!errors) return null;
    if (errors['required'] && control?.touched) return 'El número de teléfono es obligatorio.';
    if (errors['notNumeric']) return 'Solo se permiten valores numéricos.';
    if (errors['minLengthNumeric']) {
      const minLength = errors['minLengthNumeric'].requiredLength;
      return `Debe tener al menos ${minLength} dígitos.`;
    }
    return null;
  }
}