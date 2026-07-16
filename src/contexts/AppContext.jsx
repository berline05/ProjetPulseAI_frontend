import React from 'react';
import { AuthProvider } from './AuthContext';

export default function AppContext({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}