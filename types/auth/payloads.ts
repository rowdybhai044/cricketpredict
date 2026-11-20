export interface SendOTPPayload {
  mobile: string;
}

export interface VerifyOTPPayload {
  mobile: string;
  otp: string;
}



export interface LoginPayload {
  email: string;
  password: string;
}

// User Payloads
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  roleName: string;
  schoolId: string;
  isActive: boolean;
}

export interface UpdateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  roleName: string;
  schoolId: string;
  isActive: boolean;
  endPoint: string;
}

export interface GetUserByIdPayload {
  endPoint: string;
}

export interface DeleteUserPayload {
  endPoint: string;
}

// Classes Payloads
export interface GetAllClassesPayload {
  schoolId: string | null,
  page?: number,
  pageSize?: number
  endPoint: string
}