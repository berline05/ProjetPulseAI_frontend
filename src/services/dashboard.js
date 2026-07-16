const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

function getToken() {
  return localStorage.getItem("pulsai_token");
}

async function apiFetch(path) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || "Erreur serveur");
  }
  return res.json();
}

export const getKpis = () => apiFetch("/api/dashboard/kpis");
export const getConversations = (limit = 50) => apiFetch(`/api/dashboard/conversations?limit=${limit}`);
export const getConversationMessages = (convId) => apiFetch(`/api/dashboard/conversations/${convId}/messages`);
