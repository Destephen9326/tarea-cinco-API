//

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { passwordValidator, numericMinLengthValidator } from '../../shared/validators/custom.validators';
import { AuthService } from '../../shared/services/auth.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton, IonIcon, ToastController, LoadingController } from "@ionic/angular/standalone";

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
 
  public formularioRegistro: FormGroup;
  public isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    
    this.formularioRegistro = this.formBuilder.group({
      
      nombres: ['', [Validators.required]],
      
      
      correoElectronico: ['', [Validators.required, Validators.email]],
      
      
      contrasena: ['', [Validators.required, passwordValidator()]],
      
      
      numeroTelefono: ['', [Validators.required, numericMinLengthValidator(8)]],
    });
  }

  ngOnInit() {}

  /**
  
   */
  public async registrarUsuario(): Promise<void> {
    if (this.formularioRegistro.invalid) {
      
      this.formularioRegistro.markAllAsTouched(); 
      await this.mostrarToast('Por favor, completa todos los campos correctamente.', 'warning');
      return;
    }
    
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
     
      const datosUsuario = this.formularioRegistro.value;
      
      const exito = await this.authService.registrarUsuario(datosUsuario);
      
      await loading.dismiss();
      this.isLoading = false;

      if (exito) {
        
        await this.mostrarToast('¡Registro exitoso! Redirigiendo a verificación...', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/verificacion-otp']);
        }, 1500);
      } else {
        await this.mostrarToast('Error al registrar. Por favor, intenta nuevamente.', 'danger');
      }
    } catch (error) {
      await loading.dismiss();
      this.isLoading = false;
      console.error('Error en el registro:', error);
      await this.mostrarToast('Error al registrar. Por favor, intenta nuevamente.', 'danger');
    }
  }

  /**
   */
  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  /**  */
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

    if (errors['required']) {
      return 'La contraseña es obligatoria.';
    }
    if (errors['invalidPassword']) {
      return 'Debe tener min. 6 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial.';
    }
    return null;
  }

  get numeroTelefonoErrores(): string | null {
    const control = this.formularioRegistro.get('numeroTelefono');
    const errors = control?.errors;
    if (!errors) return null;

    if (errors['required'] && control?.touched) {
      return 'El número de teléfono es obligatorio.';
    }
    if (errors['notNumeric']) {
      return 'Solo se permiten valores numéricos.';
    }
    if (errors['minLengthNumeric']) {

      const minLength = errors['minLengthNumeric'].requiredLength;
      return `Debe tener al menos ${minLength} dígitos.`;
    }
    return null;
  }
}