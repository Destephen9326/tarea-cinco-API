import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { numericMinLengthValidator } from '../../shared/validators/custom.validators';
import { AuthService } from '../../shared/services/auth.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonButtons, IonBackButton, IonIcon, IonItem, IonSpinner, ToastController, LoadingController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-verificacion-otp',
  templateUrl: './verificacion-otp.page.html',
  styleUrls: ['./verificacion-otp.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonItem,
    IonSpinner
  ]
})
export class VerificacionOtpPage implements OnInit {

  public formularioOtp: FormGroup;
  public readonly MIN_LENGTH_TOKEN = 6; 
  public numeroTelefono: string = '';
  public isLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    this.formularioOtp = this.formBuilder.group({
    
      tokenVerificacion: ['', [
        Validators.required, 
        numericMinLengthValidator(this.MIN_LENGTH_TOKEN),
   
        Validators.maxLength(this.MIN_LENGTH_TOKEN) 
      ]],
    });
  }

  ngOnInit() {
    const usuario = this.authService.getUsuarioRegistro();
    if (usuario) {
      this.numeroTelefono = usuario.numeroTelefono;
      
      const otp = this.authService.getOTPGenerado();
      if (otp) {
        console.log('========================================');
        console.log('📱 VERIFICACIÓN OTP');
        console.log('========================================');
        console.log(`Teléfono: ${this.numeroTelefono}`);
        console.log(`Código OTP esperado: ${otp}`);
        console.log('========================================');
      }
    } else {
   
      console.warn('No hay usuario registrado. Redirigiendo al registro...');
      this.router.navigate(['/registro']);
    }
  }


  get tokenInvalido(): boolean {
    const control = this.formularioOtp.get('tokenVerificacion');
    return control ? control.invalid && control.touched : false;
  }



  get tokenErrores(): string | null {
    const control = this.formularioOtp.get('tokenVerificacion');
    const errors = control?.errors;
    if (!errors) return null;

    if (errors['required'] && control?.touched) {
      return 'El código de verificación es obligatorio.';
    }
    if (errors['notNumeric']) {
      return 'Solo se permiten valores numéricos.';
    }

    if (errors['minLengthNumeric'] || errors['maxlength']) {
      return `Debe ingresar exactamente ${this.MIN_LENGTH_TOKEN} dígitos.`;
    }
    return null;
  }

  
  public async verificarToken(): Promise<void> {
    if (this.formularioOtp.invalid) {
      this.formularioOtp.markAllAsTouched();
      await this.mostrarToast('Por favor, ingresa un código válido de 6 dígitos.', 'warning');
      return;
    }
    
 
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Verificando código...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const codigoIngresado = this.formularioOtp.value.tokenVerificacion;
      
  
      const esValido = this.authService.verificarOTP(codigoIngresado);
      
      await loading.dismiss();
      this.isLoading = false;

      if (esValido) {
    
        await this.mostrarToast('¡Código verificado correctamente!', 'success');
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 1500);
      } else {
   
        await this.mostrarToast('Código incorrecto. Por favor, verifica e intenta nuevamente.', 'danger');
   
        this.formularioOtp.patchValue({ tokenVerificacion: '' });
      }
    } catch (error) {
      await loading.dismiss();
      this.isLoading = false;
      console.error('Error al verificar OTP:', error);
      await this.mostrarToast('Error al verificar el código. Por favor, intenta nuevamente.', 'danger');
    }
  }

  public async reenviarCodigo(): Promise<void> {
    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Reenviando código...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const nuevoOTP = await this.authService.reenviarOTP();
      await loading.dismiss();
      this.isLoading = false;
      
      await this.mostrarToast('Código reenviado. Revisa la consola para ver el nuevo código.', 'success');
    } catch (error) {
      await loading.dismiss();
      this.isLoading = false;
      console.error('Error al reenviar OTP:', error);
      await this.mostrarToast('Error al reenviar el código. Por favor, intenta nuevamente.', 'danger');
    }
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
}