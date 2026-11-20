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
