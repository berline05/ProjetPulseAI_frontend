// src/components/ProtectedRoute.jsx
// Protège les routes qui nécessitent une authentification.
// Si l'utilisateur n'est pas connecté → redirige vers /login

import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Mémorise la page demandée pour y rediriger après login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}