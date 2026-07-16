// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getCompany } from "../services/auth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Rediriger vers l'onboarding si pas encore complété (sauf si on y est déjà)
  const company = getCompany();
  if (company && !company.onboarding_completed && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
