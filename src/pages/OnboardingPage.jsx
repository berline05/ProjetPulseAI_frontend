// src/pages/OnboardingPage.jsx — Wizard de configuration initiale après inscription
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8001";

const SECTORS = [
  "Commerce & Retail", "Immobilier", "Santé & Bien-être", "Formation & Education",
  "Restaurant & Food", "Beauté & Mode", "Finance & Assurance", "Tech & SaaS",
  "Transport & Logistique", "Tourisme & Hôtellerie", "Autre",
];

const CHANNELS = [
  { id: "web",       label: "Widget Web",  icon: "🌐" },
  { id: "whatsapp",  label: "WhatsApp",    icon: "📱" },
  { id: "telegram",  label: "Telegram",    icon: "✈️" },
  { id: "email",     label: "Email",       icon: "📧" },
];

const TONES = [
  { id: "professional", label: "Professionnel", desc: "Courtois et efficace" },
  { id: "friendly",     label: "Chaleureux",    desc: "Proche et décontracté" },
  { id: "formal",       label: "Formel",        desc: "Institutionnel et sérieux" },
  { id: "casual",       label: "Informel",      desc: "Détendu et moderne" },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [step, setStep]   = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");

  const [form, setForm] = useState({
    bot_name:        user?.company_name ? `Assistant ${user.company_name}` : "Mon Assistant",
    sector:          "",
    active_channels: ["web"],
    ai_tone:         "professional",
    ai_instructions: "",
    ai_products:     [],
  });

  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "" });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleChannel = (id) => {
    set("active_channels",
      form.active_channels.includes(id)
        ? form.active_channels.filter(c => c !== id)
        : [...form.active_channels, id]
    );
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return;
    set("ai_products", [...form.ai_products, { ...newProduct }]);
    setNewProduct({ name: "", description: "", price: "" });
  };

  const removeProduct = (i) => set("ai_products", form.ai_products.filter((_, idx) => idx !== i));

  const canNext = () => {
    if (step === 1) return form.bot_name.trim() && form.sector;
    if (step === 2) return form.active_channels.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("pulsai_token");
      const res = await fetch(`${API_BASE}/api/auth/onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || "Erreur serveur");
      setUser(data.company);
      localStorage.setItem("pulsai_company", JSON.stringify(data.company));
      navigate("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] flex items-center justify-center px-4"
      style={{ fontFamily: "'Ubuntu', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Ubuntu:wght@300;400;500&display=swap'); .font-unbounded{font-family:'Unbounded',sans-serif!important}`}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(53,144,227,0.12)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-unbounded font-black text-2xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent">PulsAI</span>
          <h1 className="font-unbounded font-black text-2xl text-white mt-4 mb-2">Configuration initiale</h1>
          <p className="text-sm text-white/40">Personnalisez votre assistant IA en 3 étapes</p>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1,2,3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? "bg-[#3590E3]" : "bg-white/10"}`} />
          ))}
        </div>

        <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-8 shadow-2xl">

          {/* ── STEP 1 : Identité du bot ── */}
          {step === 1 && (
            <div>
              <h2 className="font-unbounded font-bold text-lg text-white mb-1">Votre assistant</h2>
              <p className="text-xs text-white/40 mb-6">Comment s'appelle votre bot et dans quel secteur travaillez-vous ?</p>

              <label className="block text-xs text-white/50 mb-1.5">Nom du bot</label>
              <input value={form.bot_name} onChange={e => set("bot_name", e.target.value)}
                placeholder="Ex : AssistantPro, SophieIA…"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm outline-none focus:border-[#3590E3] focus:ring-2 focus:ring-[#3590E3]/15 mb-5" />

              <label className="block text-xs text-white/50 mb-2">Secteur d'activité</label>
              <div className="grid grid-cols-2 gap-2">
                {SECTORS.map(s => (
                  <button key={s} type="button" onClick={() => set("sector", s)}
                    className={`px-3 py-2 rounded-xl text-xs text-left transition-all ${form.sector === s ? "bg-[#3590E3]/20 border border-[#3590E3]/60 text-[#3590E3]" : "bg-white/[0.03] border border-white/[0.06] text-white/50 hover:text-white/80"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 2 : Canaux ── */}
          {step === 2 && (
            <div>
              <h2 className="font-unbounded font-bold text-lg text-white mb-1">Canaux actifs</h2>
              <p className="text-xs text-white/40 mb-6">Sur quels canaux votre assistant sera-t-il disponible ?</p>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map(ch => (
                  <button key={ch.id} type="button" onClick={() => toggleChannel(ch.id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${form.active_channels.includes(ch.id) ? "bg-[#3590E3]/15 border-[#3590E3]/50" : "bg-white/[0.03] border-white/[0.06] hover:border-white/20"}`}>
                    <span className="text-2xl">{ch.icon}</span>
                    <div className="text-left">
                      <p className={`text-sm font-medium ${form.active_channels.includes(ch.id) ? "text-[#3590E3]" : "text-white/70"}`}>{ch.label}</p>
                    </div>
                    {form.active_channels.includes(ch.id) && <span className="ml-auto text-[#3590E3] text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3 : Config IA ── */}
          {step === 3 && (
            <div>
              <h2 className="font-unbounded font-bold text-lg text-white mb-1">Personnalité & Produits</h2>
              <p className="text-xs text-white/40 mb-6">Définissez le ton de votre assistant et vos offres (optionnel).</p>

              <label className="block text-xs text-white/50 mb-2">Ton de l'assistant</label>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {TONES.map(t => (
                  <button key={t.id} type="button" onClick={() => set("ai_tone", t.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${form.ai_tone === t.id ? "bg-[#3590E3]/15 border-[#3590E3]/50" : "bg-white/[0.03] border-white/[0.06] hover:border-white/20"}`}>
                    <p className={`text-xs font-medium ${form.ai_tone === t.id ? "text-[#3590E3]" : "text-white/70"}`}>{t.label}</p>
                    <p className="text-[10px] text-white/30 mt-0.5">{t.desc}</p>
                  </button>
                ))}
              </div>

              <label className="block text-xs text-white/50 mb-1.5">Instructions spéciales (optionnel)</label>
              <textarea value={form.ai_instructions} onChange={e => set("ai_instructions", e.target.value)}
                rows={3} placeholder="Ex : Toujours proposer une démo gratuite avant de mentionner les prix…"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-[#3590E3] focus:ring-2 focus:ring-[#3590E3]/15 mb-5 resize-none" />

              <label className="block text-xs text-white/50 mb-2">Produits / Services (optionnel)</label>
              {form.ai_products.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate">{p.name} — {p.price} FCFA</p>
                    <p className="text-[10px] text-white/30 truncate">{p.description}</p>
                  </div>
                  <button onClick={() => removeProduct(i)} className="text-red-400/60 hover:text-red-400 text-sm shrink-0">✕</button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))}
                  placeholder="Nom" className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-[#3590E3]" />
                <input value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))}
                  placeholder="Prix FCFA" type="number" className="w-24 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-[#3590E3]" />
                <button onClick={addProduct} className="px-3 py-2 rounded-lg bg-[#3590E3]/20 text-[#3590E3] text-xs hover:bg-[#3590E3]/30 transition-all">+</button>
              </div>
              <input value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))}
                placeholder="Description courte" className="w-full mt-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-white text-xs outline-none focus:border-[#3590E3]" />
            </div>
          )}

          {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/40 text-sm hover:text-white/70 transition-all">
                ← Retour
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="flex-1 py-3 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] disabled:opacity-40 transition-all">
                Suivant →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#3590E3] to-[#2a7fd4] text-white text-sm font-medium hover:opacity-90 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement…</> : "🚀 Lancer mon assistant"}
              </button>
            )}
          </div>

          <p className="text-center text-xs text-white/20 mt-4">
            {step === 3 && <button onClick={() => navigate("/dashboard")} className="hover:text-white/40 transition-all">Passer pour l'instant →</button>}
          </p>
        </div>
      </div>
    </div>
  );
}
