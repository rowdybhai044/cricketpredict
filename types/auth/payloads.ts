export interface LoginPasswordPayload {
  mobile: string;
  password: string;
}

export interface LoginSendOTPPayload {
  mobile: string;
}

export interface VerifyOTPPayload {
  mobile: string;
  otp: string;
  action: string;
}

export interface ResendOTPPayload {
  mobile: string;
  action: string;
}

export interface SignUpSendOTPPayload {
  name: string;
  date_of_birth: string;
  password: string;
  mobile: string;
}

export interface ForgotPasswordSendOTPPayload {
  mobile: string;
}

export interface ForgotPasswordResetPayload {
  mobile: string;
  otp: string;
  new_password: string;
  confirm_new_password: string;
}