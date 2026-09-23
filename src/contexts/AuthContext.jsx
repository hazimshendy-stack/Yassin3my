import { createContext, useContext, useEffect, useState, useCallback } from 'react';
const KEY = 'egy.auth.user';
const AuthCtx = createContext(null);
function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; } }
export function AuthProvider({ children }) {
  const [user, setUser] = useState(read);
  const [ready, setReady] = useState(false);
  useEffect(() => { setUser(read()); setReady(true); }, []);
  const login = useCallback((email, name) => {
    const u = { id: 'u-' + Date.now(), email, name: name || email.split('@')[0], role: 'student', joinedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);
  const register = useCallback((payload) => {
    const u = { id: 'u-' + Date.now(), email: payload.email, name: payload.name, role: 'student', joinedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);
  const logout = useCallback(() => { localStorage.removeItem(KEY); setUser(null); }, []);
  const updateProfile = useCallback((patch) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  return <AuthCtx.Provider value={{ user, ready, login, register, logout, updateProfile }}>{children}</AuthCtx.Provider>;
}
export function useAuth() {
  const c = useContext(AuthCtx);
  if (!c) throw new Error('useAuth needs AuthProvider');
  return c;
}
