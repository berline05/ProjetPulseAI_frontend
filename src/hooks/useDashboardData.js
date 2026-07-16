import { useState, useEffect } from "react";
import { getKpis, getConversations } from "../services/dashboard";

const STAGE_SCORES = {
  greeting: 25,
  qualification: 50,
  presentation: 65,
  objection: 75,
  payment: 90,
  completed: 100,
};

const STAGE_LABELS = {
  greeting: "Accueil",
  qualification: "Qualification",
  presentation: "Présentation",
  objection: "Objection",
  payment: "Paiement",
  completed: "Converti",
};

function formatRelativeTime(isoString) {
  if (!isoString) return "";
  const diff = (Date.now() - new Date(isoString + (isoString.includes("Z") ? "" : "Z")).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} j`;
}

function toInitials(userId) {
  const digits = userId.replace(/\D/g, "").slice(-4);
  if (digits.length >= 2) return digits.slice(0, 2);
  return userId.slice(0, 2).toUpperCase();
}

function transformConversation(conv) {
  const score = STAGE_SCORES[conv.stage] || 30;
  const status = score >= 75 ? "hot" : score >= 50 ? "warm" : "cold";
  return {
    id: conv.id,
    name: conv.user_id,
    email: conv.channel,
    score,
    status,
    lastMsg: conv.last_message || "…",
    time: formatRelativeTime(conv.updated_at),
    stage: STAGE_LABELS[conv.stage] || conv.stage,
    avatar: toInitials(conv.user_id),
    unread: 0,
  };
}

export function useDashboardData() {
  const [kpisData, setKpisData] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = () => {
    setLoading(true);
    setError(null);
    Promise.all([getKpis(), getConversations()])
      .then(([kpis, convs]) => {
        setKpisData(kpis);
        setConversations(convs.map(transformConversation));
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  return { kpisData, conversations, loading, error, refresh };
}
