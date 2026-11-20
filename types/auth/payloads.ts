export interface LoginSendOTPPayload {
  mobile: string;
}

export interface LoginVerifyOTPPayload {
  mobile: string;
  otp: string;
}

export interface SignUpSendOTPPayload {
  name: string;
  date_of_birth: string;
  password: string;
  mobile: string;
}

export interface SignUpVerifyOTPPayload {
  mobile: string;
  otp: string;
}