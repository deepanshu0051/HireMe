/**
 * Auth Utility Helpers
 * Centralizes localStorage token management for the HireMe app.
 */

const TOKEN_KEY = 'hireme_token';
const ROLE_KEY = 'hireme_role';

/** Returns the stored JWT token, or null */
export const getToken = () => localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);

/** Returns the stored role by decoding the JWT securely */
export const getRole = () => {
  const token = getToken();
  if (!token) return null;
  try {
    const payloadStart = token.indexOf('.') + 1;
    const payloadEnd = token.indexOf('.', payloadStart);
    const base64Url = token.substring(payloadStart, payloadEnd);
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload).role;
  } catch (e) {
    return null;
  }
};

/** Returns true if the current role is 'guest' */
export const isGuest = () => getRole() === 'guest';

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
