// src/services/auth.js
// Service d'authentification — connecte le frontend React au backend FastAPI

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

// ─── Helpers ────────────────────────────────────────────

function getToken() {
  return localStorage.getItem("pulsai_token");
}

function setToken(token, expiresAt) {
  localStorage.setItem("pulsai_token", token);
  localStorage.setItem("pulsai_token_exp", expiresAt);
}

function removeToken() {
  localStorage.removeItem("pulsai_token");
  localStorage.removeItem("pulsai_company");
}

function setCompany(company) {
  localStorage.setItem("pulsai_company", JSON.stringify(company));
}

export function getCompany() {
  const raw = localStorage.getItem("pulsai_company");
  return raw ? JSON.parse(raw) : null;
}

export function isAuthenticated() {
  const token = getToken();
  const exp = localStorage.getItem("pulsai_token_exp");
  if (!token) return false;
  if (exp && Date.now() / 1000 > Number(exp)) {
    removeToken();
    return false;
  }
  return true;
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Vérifie que la réponse est bien du JSON avant de parser
  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.detail || "Erreur serveur");
  }
  return data;
}


// ─── INSCRIPTION ────────────────────────────────────────

export async function register({ firstName, lastName, email, companyName, password }) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      first_name:   firstName,
      last_name:    lastName,
      email,
      company_name: companyName,
      password,
    }),
  });
}


// ─── VÉRIFICATION EMAIL ─────────────────────────────────

export async function verifyEmail(token) {
  return apiFetch(`/api/auth/verify-email?token=${token}`, {
    method: "GET",
  });
}

// ─── CONNEXION ──────────────────────────────────────────

export async function login({ email, password }) {
  const data = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Stocker le token et les infos entreprise
  setToken(data.token);
  setCompany(data.company);
  return data;
}


// ─── DÉCONNEXION ────────────────────────────────────────

export function logout() {
  removeToken();
}


// ─── MON PROFIL ─────────────────────────────────────────

export async function getMe() {
  return apiFetch("/api/auth/me");
}


// ─── MOT DE PASSE OUBLIÉ ────────────────────────────────

export async function forgotPassword(email) {
  return apiFetch("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}


// ─── RÉINITIALISER MOT DE PASSE ─────────────────────────

export async function resetPassword({ token, newPassword }) {
  return apiFetch("/api/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}