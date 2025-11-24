import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { IonicModule, NavController, ModalController } from '@ionic/angular'; // <--- 1. Agregado ModalController
import { Login } from '../../../../app/core/interfaces/login.interface';

import { RecuperarPasswordComponent } from '../recuperar-password/recuperar-password.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.page.html',
  styleUrls: ['./login-page.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule]
})
export class LoginPagePage implements OnInit {
  
  public formularioLogin!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private modalCtrl: ModalController // <--- 3. Inyectamos el controlador
  ) { }

  ngOnInit() {
    this.formularioLogin = this.fb.group({
      correoElectronico: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required]]
    });
  }

  // 
  
  get correoControl(): AbstractControl | null {
    return this.formularioLogin.get('correoElectronico');
  }

  get contrasenaControl(): AbstractControl | null {
    return this.formularioLogin.get('contrasena');
  }

  get correoInvalido(): boolean {
    return !!(this.correoControl?.invalid && this.correoControl?.touched);
  }

  get contrasenaInvalida(): boolean {
    return !!(this.contrasenaControl?.invalid && this.contrasenaControl?.touched);
  }

  // --- ACCIONES ---

  async ingresar() {
    if (this.formularioLogin.valid) {
      const datos: Login = this.formularioLogin.value;
      console.log('Login válido:', datos);
      this.navCtrl.navigateRoot('/home'); 
    } else {
      this.formularioLogin.markAllAsTouched();
    }
  }

  async abrirModalRecuperar() {
    const modal = await this.modalCtrl.create({
      component: RecuperarPasswordComponent
    });
    await modal.present();
  }
}