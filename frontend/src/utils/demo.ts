export const isDemoMode = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return token === 'demo-customer-token' || token === 'demo-admin-token';
};
