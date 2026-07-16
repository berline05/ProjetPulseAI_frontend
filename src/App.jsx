import { Routes, Route, Navigate } from 'react-router-dom'
import { isAuthenticated } from "./services/auth";
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import LandingPage from './pages/Landingpage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VerifyEmailPage from "./pages/VerifyEmailPage";
import WidgetPage from "./pages/WidgetPage";
import OnboardingPage from "./pages/OnboardingPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Route publique uniquement (redirige si déjà connecté)
function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function App() {
  return (
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={
          <PublicOnlyRoute> 
            <Login /> 
          </PublicOnlyRoute>} 
        />

        <Route path='/register' element={
          <PublicOnlyRoute> 
            <Register /> 
          </PublicOnlyRoute>} 
        />

        <Route path='/dashboard' element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>}
        />
        <Route path='/onboarding' element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>}
        />
        {/* Vérification email — accessible sans connexion */}
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        {/* Widget chat — accessible en iframe depuis les sites clients */}
        <Route path="/widget" element={<WidgetPage />} />
      </Routes>
  )
}

export default App
