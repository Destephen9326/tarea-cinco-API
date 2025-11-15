// custom.validators.ts

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    
    if (!value) {
      return null;
    }

    
    const minLengthValid = value.length >= 6;
    
    
    const hasLowercase = /[a-z]/.test(value);
    
   
    const hasUppercase = /[A-Z]/.test(value);
    
    
    const hasNumeric = /[0-9]/.test(value);
    
    
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    const passwordValid = minLengthValid && hasLowercase && hasUppercase && hasNumeric && hasSpecial;

 
    return !passwordValid ? { 'invalidPassword': true } : null;
  };
}

/**
 
 * @param minLength - Longitud mínima requerida.
 */
export function numericMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    
    if (!value) {
      return null;
    }

    
    const isNumeric = /^\d+$/.test(value);
    
    
    const hasMinLength = value.length >= minLength;

    if (!isNumeric) {
      
      return { 'notNumeric': true };
    }

    if (!hasMinLength) {
      
      return { 'minLengthNumeric': { requiredLength: minLength, actualLength: value.length } };
    }

    return null;
  };
}