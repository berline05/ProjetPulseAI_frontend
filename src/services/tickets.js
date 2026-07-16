const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

function getToken() {
  return localStorage.getItem("pulsai_token");
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
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.detail || "Erreur serveur");
  }
  return res.json();
}

export const getTickets = () => apiFetch("/api/tickets/");
export const createTicket = (data) => apiFetch("/api/tickets/", { method: "POST", body: JSON.stringify(data) });
export const updateTicket = (uuid, data) => apiFetch(`/api/tickets/${uuid}`, { method: "PUT", body: JSON.stringify(data) });
export const deleteTicket = (uuid) => apiFetch(`/api/tickets/${uuid}`, { method: "DELETE" });
