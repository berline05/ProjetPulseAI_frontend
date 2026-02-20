import React from 'react';
import { AuthProvider } from '../hooks/useAuth';

export default function AppContext({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}