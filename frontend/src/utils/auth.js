/**
 * Auth Utility Helpers
 * Centralizes localStorage token management for the HireMe app.
 */

const TOKEN_KEY = 'hireme_token';
const ROLE_KEY = 'hireme_role';

/** Returns the stored JWT token, or null */
export const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

/** Returns the stored role ('admin' | 'guest'), or null */
export const getRole = () => localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY);

/** Returns true if the current role is 'guest' */
export const isGuest = () => (localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY)) === 'guest';

/** Returns true if a token is present in either storage */
export const isAuthed = () => Boolean(localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY));

/** Saves token + role to appropriate storage based on role */
export const saveAuth = (token, role) => {
  if (role === 'admin') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(ROLE_KEY, role);
  }
};

/** Clears token + role from both storages */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem('hireme_gate_passed');
};
