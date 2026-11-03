import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);
const storageKey = 'labmate-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  });

  async function login(role) {
    const result = await api.login(role);
    localStorage.setItem(storageKey, JSON.stringify(result.user));
    setUser(result.user);
  }

  function logout() {
    localStorage.removeItem(storageKey);
    setUser(null);
  }

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}
