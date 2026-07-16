// src/context/AuthContext.jsx
// Context d'authentification unifié — connecté au vrai backend Django

import { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as authLogout, isAuthenticated, getCompany } from '../services/auth';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Au démarrage : si un token JWT existe, charge le profil
    const init = async () => {
      if (isAuthenticated()) {
        try {
          // D'abord on charge depuis le localStorage (instantané)
          const cached = getCompany();
          if (cached) setUser(cached);

          // Puis on vérifie auprès du backend (données fraîches)
          const fresh = await getMe();
          setUser(fresh);
        } catch (err) {
          // Token expiré ou invalide → déconnexion propre
          console.warn('[Auth] Session expirée:', err.message);
          authLogout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  // Appelé après un login réussi pour mettre à jour le context
  const refreshUser = async () => {
    try {
      const fresh = await getMe();
      setUser(fresh);
      return fresh;
    } catch (err) {
      setUser(null);
      return null;
    }
  };

  const logout = () => {
    authLogout(); // supprime le token + redirige /login
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, refreshUser, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}