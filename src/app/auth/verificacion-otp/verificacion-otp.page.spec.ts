import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificacionOtpPage } from './verificacion-otp.page';

describe('VerificacionOtpPage', () => {
  let component: VerificacionOtpPage;
  let fixture: ComponentFixture<VerificacionOtpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionOtpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
