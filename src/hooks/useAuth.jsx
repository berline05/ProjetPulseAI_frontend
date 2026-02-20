import { createContext, useContext, useState, useEffect } from 'react';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // MVP: simple local mock
  useEffect(() => {
    const stored = localStorage.getItem('pulsai-user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = async () => {
    // mock login
    const u = { id: 'u-001', name: 'Demo User', email: 'demo@example.com' };
    setUser(u);
    localStorage.setItem('pulsai-user', JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pulsai-user');
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}