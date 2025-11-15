import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UsuarioRegistro {
  nombres: string;
  correoElectronico: string;
  contrasena: string;
  numeroTelefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioRegistroSubject = new BehaviorSubject<UsuarioRegistro | null>(null);
  public usuarioRegistro$: Observable<UsuarioRegistro | null> = this.usuarioRegistroSubject.asObservable();
  
 
  private otpGenerado: string | null = null;

  
  private generarOTP(): string {
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return otp;
  }


  registrarUsuario(usuario: UsuarioRegistro): Promise<boolean> {
    return new Promise((resolve) => {
     
      setTimeout(() => {
      
        this.usuarioRegistroSubject.next(usuario);
        

        this.otpGenerado = this.generarOTP();
        
      
        console.log('========================================');
        console.log('🔐 CÓDIGO OTP GENERADO');
        console.log('========================================');
        console.log(`📱 Teléfono: ${usuario.numeroTelefono}`);
        console.log(`🔑 Código OTP: ${this.otpGenerado}`);
        console.log('========================================');
        console.log('⚠️  NOTA: En producción, este código se enviaría por SMS');
        console.log('========================================');
        
        
        console.log('Usuario registrado:', usuario);
        resolve(true);
      }, 1000); // Simulamos 1 segundo de delay
    });
  }

  verificarOTP(codigoIngresado: string): boolean {
    if (!this.otpGenerado) {
      console.error('No hay OTP generado. Por favor, regístrese primero.');
      return false;
    }

    const esValido = codigoIngresado === this.otpGenerado;
    
    if (esValido) {
      console.log('✅ OTP verificado correctamente');
      
    } else {
      console.error('❌ OTP incorrecto. Código esperado:', this.otpGenerado);
    }
    
    return esValido;
  }

 
  getOTPGenerado(): string | null {
    return this.otpGenerado;
  }

 
  getUsuarioRegistro(): UsuarioRegistro | null {
    return this.usuarioRegistroSubject.value;
  }

 
  limpiarUsuario(): void {
    this.usuarioRegistroSubject.next(null);
    this.otpGenerado = null;
  }

 
  reenviarOTP(): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.otpGenerado = this.generarOTP();
        const usuario = this.usuarioRegistroSubject.value;
        
        console.log('========================================');
        console.log('🔄 CÓDIGO OTP REENVIADO');
        console.log('========================================');
        console.log(`📱 Teléfono: ${usuario?.numeroTelefono || 'N/A'}`);
        console.log(`🔑 Nuevo Código OTP: ${this.otpGenerado}`);
        console.log('========================================');
        
        resolve(this.otpGenerado);
      }, 500);
    });
  }
}

