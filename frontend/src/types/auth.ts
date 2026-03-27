export interface AuthCustomerSignupBody {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}

export interface AuthAdminSignupBody {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthLoginBody {
  email: string;
  password: string;
}

export interface AuthCustomerResponse {
  token: string;
  customerId: string;
  email: string;
}

export interface AuthAdminResponse {
  token: string;
  adminId: string;
  email: string;
}
