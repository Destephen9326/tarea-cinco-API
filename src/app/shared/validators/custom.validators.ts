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
 * @param minLength - Longitud mínima requerida (solo cuenta los dígitos).
 */
export function numericMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    
    if (!value) {
      return null;
    }

  
    const cleanedValue = value.toString().replace(/\s+/g, '');
    
   
    const isValidFormat = /^(\+\d+|\d+)$/.test(cleanedValue);
    
    if (!isValidFormat) {
      return { 'notNumeric': true };
    }

 
    const digitCount = cleanedValue.replace(/[^\d]/g, '').length;
    
    if (digitCount < minLength) {
      return { 'minLengthNumeric': { requiredLength: minLength, actualLength: digitCount } };
    }

    return null;
  };
}