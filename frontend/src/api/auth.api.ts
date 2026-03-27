import apiClient from './client';
import type {
  AuthCustomerSignupBody,
  AuthAdminSignupBody,
  AuthLoginBody,
  AuthCustomerResponse,
  AuthAdminResponse,
} from '../types/auth';

export const authApi = {
  customerSignup: (body: AuthCustomerSignupBody) =>
    apiClient.post<AuthCustomerResponse>('/auth/customer/signup', body).then((r) => r.data),

  customerLogin: (body: AuthLoginBody) =>
    apiClient.post<AuthCustomerResponse>('/auth/customer/login', body).then((r) => r.data),

  adminSignup: (body: AuthAdminSignupBody) =>
    apiClient.post<AuthAdminResponse>('/auth/admin/signup', body).then((r) => r.data),

  adminLogin: (body: AuthLoginBody) =>
    apiClient.post<AuthAdminResponse>('/auth/admin/login', body).then((r) => r.data),
};
