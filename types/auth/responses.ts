export interface LoginData {
  success: boolean;
  message: string;
  tokens: {
    refresh: string;
    access: string;
  };
  user: {
    id: number;
    mobile: string;
    name: string;
    date_of_birth: string;
    role: string;
    wallet_balance: string;
    date_joined: string;
  }
}

export type LoginPasswordResponse = LoginData;

export interface LoginSendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export type VerifyOTPResponse = LoginData;

export interface SignUpSendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface ResendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
  action: string;
}

export interface ForgotPasswordSendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface ForgotPasswordResetResponse {
  success: boolean;
  message: string;
}