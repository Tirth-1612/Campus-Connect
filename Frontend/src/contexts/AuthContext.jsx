import { createContext, useContext, useMemo, useState } from 'react';
import { storage, TOKEN_KEY, USER_KEY } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => storage.get(TOKEN_KEY, null));
  const [user, setUser] = useState(() => storage.get(USER_KEY, null));

  const login = (tk, usr) => {
    setToken(tk); setUser(usr);
    storage.set(TOKEN_KEY, tk); storage.set(USER_KEY, usr);
  };
  const logout = () => { setToken(null); setUser(null); storage.remove(TOKEN_KEY); storage.remove(USER_KEY); };
  const updateUser = (patch) => { const u = { ...user, ...patch }; setUser(u); storage.set(USER_KEY, u); };

  const value = useMemo(() => ({ token, user, isAuthenticated: !!token, login, logout, updateUser }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
