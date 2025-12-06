export interface LoginRequest {
  identifier: string;
  password: string;
  method: number;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface CreateAccountRequest {
  names: string;
  surnames: string;
  address: string | null;
  phoneNumber: string;
  email: string;
  password: string;
  fcmToken: string | null;
}

export interface PhoneVerificationRequest {
  phoneNumber: string;
}

export interface PhoneVerifyRequest {
  phoneNumber: string;
  token: string;
}