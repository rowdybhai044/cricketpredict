export interface LoginSendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface LoginVerifyOTPResponse {
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

export interface SignUpSendOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}

export interface SignUpVerifyOTPResponse {
  success: boolean;
  message: string;
  mobile: string;
}