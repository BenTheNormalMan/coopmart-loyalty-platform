const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user'; // If you want to store user details 

export const storage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  removeToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
  
  clearSession: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};
