import { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

function getApiKey() {
  return new URLSearchParams(window.location.search).get("api_key") || "";
}

function getUserId() {
  let id = sessionStorage.getItem("pulsai_wuid");
  if (!id) {
    id = `w_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("pulsai_wuid", id);
  }
  return id;
}

async function sendMessage(apiKey, userId, message, history) {
  const res = await fetch(`${API_BASE}/api/widget/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({ user_id: userId, message, history }),
  });
  if (!res.ok) throw new Error("Erreur réseau");
  return res.json();
}

function BotIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="3" />
      <line x1="12" y1="8" x2="12" y2="11" />
      <line x1="7" y1="16" x2="7" y2="16" strokeLinecap="round" strokeWidth="3" />
      <line x1="12" y1="16" x2="12" y2="16" strokeLinecap="round" strokeWidth="3" />
      <line x1="17" y1="16" x2="17" y2="16" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export default function WidgetPage() {
  const apiKey = getApiKey();
  const userId = getUserId();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [companyName, setCompanyName] = useState("PulsAI");
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!apiKey) return;
    fetch(`${API_BASE}/api/widget/config`, { headers: { "X-Api-Key": apiKey } })
      .then(r => r.json())
      .then(cfg => {
        setCompanyName(cfg.company_name || "PulsAI");
        setMessages([{
          role: "ai",
          text: `Bonjour ! Je suis l'assistant de ${cfg.company_name || "PulsAI"}. Comment puis-je vous aider aujourd'hui ?`,
          time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
        }]);
      })
      .catch(() => {
        setMessages([{
          role: "ai",
          text: "Bonjour ! Comment puis-je vous aider ?",
          time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
        }]);
      });
  }, [apiKey]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    if (!input.trim() || loading || !apiKey) return;
    const text = input.trim();
    setInput("");
    const now = new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { role: "user", text, time: now }]);
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));
      history.push({ role: "user", content: text });

      const resp = await sendMessage(apiKey, userId, text, history);
      setMessages(prev => [...prev, {
        role: "ai",
        text: resp.text,
        time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "Désolé, une erreur est survenue. Veuillez réessayer.",
        time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [input, loading, apiKey, userId, messages]);

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  if (!apiKey) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#0B0F1A", color: "rgba(232,237,245,0.4)", fontSize: "13px", fontFamily: "system-ui, sans-serif" }}>
        Clé API manquante
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#0B0F1A", fontFamily: "'Helvetica Neue', Arial, sans-serif", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "linear-gradient(135deg, #3590E3, #BAF09D)", display: "flex", alignItems: "center", justifyContent: "center", color: "#0B0F1A", flexShrink: 0 }}>
          <BotIcon />
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: "700", color: "#E8EDF5" }}>{companyName}</div>
          <div style={{ fontSize: "11px", color: "rgba(232,237,245,0.35)", display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#BAF09D", display: "inline-block" }} />
            Assistant IA · En ligne
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: "8px" }}>
            {msg.role === "ai" && (
              <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(53,144,227,0.15)", border: "1px solid rgba(53,144,227,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3590E3", flexShrink: 0 }}>
                <BotIcon />
              </div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
              background: msg.role === "user" ? "rgba(186,240,157,0.12)" : "rgba(255,255,255,0.05)",
              border: msg.role === "user" ? "1px solid rgba(186,240,157,0.2)" : "1px solid rgba(255,255,255,0.08)",
              fontSize: "13px",
              lineHeight: "1.6",
              color: "rgba(232,237,245,0.85)",
              whiteSpace: "pre-wrap",
            }}>
              {msg.text}
              <div style={{ fontSize: "10px", color: "rgba(232,237,245,0.2)", marginTop: "4px", textAlign: "right" }}>{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "8px", background: "rgba(53,144,227,0.15)", border: "1px solid rgba(53,144,227,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#3590E3", flexShrink: 0 }}>
              <BotIcon />
            </div>
            <div style={{ padding: "12px 16px", borderRadius: "16px 16px 16px 4px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", gap: "4px", alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3590E3", opacity: 0.6, animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px", background: "#111827", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Votre message…"
            rows={1}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#E8EDF5",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: "1.5",
              minHeight: "40px",
              maxHeight: "100px",
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: input.trim() && !loading ? "#3590E3" : "rgba(53,144,227,0.2)",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !loading ? "white" : "rgba(53,144,227,0.5)"} strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: "10px", color: "rgba(232,237,245,0.15)", margin: "6px 0 0" }}>
          Propulsé par <span style={{ color: "rgba(53,144,227,0.6)" }}>PulsAI</span>
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        textarea::placeholder { color: rgba(232,237,245,0.25); }
        textarea:focus { border-color: rgba(53,144,227,0.5) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>
    </div>
  );
}
