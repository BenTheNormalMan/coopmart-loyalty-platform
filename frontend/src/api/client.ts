import axios, { AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor: attach JWT ────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: handle 401 globally ─────────────────────────────────
apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Hard redirect to login, preserving the current role path signal
      const isAdmin = window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/auth/admin');
      window.location.href = isAdmin ? '/auth/admin/login' : '/auth/customer/login';
    }
    return Promise.reject(error);
  }
);

/** Extract a human-readable error message from an Axios error. */
export function getErrorMessage(err: unknown): string {
  if (err instanceof AxiosError && err.response?.data) {
    const data = err.response.data as { message?: string; errors?: Array<{ message: string }> };
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map((e) => e.message).join(', ');
    }
    if (data.message) return data.message;
  }
  return 'Đã xảy ra lỗi, vui lòng thử lại.';
}

export default apiClient;
