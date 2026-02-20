import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

// ─── React Icons ───
import { RiDashboardLine } from "react-icons/ri";
import {
  IoChatbubblesOutline,
  IoTicketOutline,
  IoFlashOutline,
  IoBarChartOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoSearchOutline,
  IoNotificationsOutline,
  IoSendOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoEllipsisHorizontal,
  IoCloseOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoAddOutline,
  IoTrashOutline,
  IoPencilOutline,
  IoAttachOutline,
  IoChatbubbleOutline,
} from "react-icons/io5";
import {
  HiOutlineFire,
  HiOutlineTrendingUp,
  HiOutlineCurrencyDollar,
  HiOutlineCreditCard,
  HiOutlineClipboardList,
  HiOutlineMail,
  HiOutlineCalendar,
  HiOutlineRefresh,
  HiOutlineChip,
} from "react-icons/hi";
import { MdOutlinePayment, MdOutlineSupportAgent } from "react-icons/md";
import { TbRobot } from "react-icons/tb";
import { BsArrowUpShort } from "react-icons/bs";

/* ══════════════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════════════ */
const MOCK_USER = { name: "Kofi Mensah", company: "TechAfrique", plan: "Business", avatar: "KM" };

const MOCK_CONVERSATIONS = [
  { id: 1, name: "Sophie Martin",  email: "sophie@acme.fr",    score: 92, status: "hot",  lastMsg: "Quel est le délai de mise en place ?", time: "2 min",  stage: "Négociation",   avatar: "SM", unread: 2 },
  { id: 2, name: "David Koné",     email: "david@startup.ci",  score: 76, status: "warm", lastMsg: "Vous avez un essai gratuit ?",          time: "14 min", stage: "Découverte",    avatar: "DK", unread: 0 },
  { id: 3, name: "Amina Traoré",   email: "amina@retail.ma",   score: 88, status: "hot",  lastMsg: "Je voudrais comparer les plans.",       time: "1 h",    stage: "Qualification", avatar: "AT", unread: 1 },
  { id: 4, name: "Romain Dubois",  email: "romain@fintech.fr", score: 61, status: "cold", lastMsg: "Merci pour les infos.",                 time: "3 h",    stage: "Prospection",   avatar: "RD", unread: 0 },
  { id: 5, name: "Fatou Diop",     email: "fatou@ngo.sn",      score: 83, status: "warm", lastMsg: "Est-ce que l'IA parle wolof ?",         time: "5 h",    stage: "Qualification", avatar: "FD", unread: 0 },
];

const INITIAL_TICKETS = [
  {
    id: "T-041",
    title: "Problème d'intégration Stripe",
    description: "L'API Stripe ne répond pas lors du webhook de paiement. Erreur 500 observée.",
    category: "incident",
    priority: "high",
    status: "open",
    assignedTo: "Équipe Tech",
    client: "Sophie Martin",
    createdAt: "2024-01-15",
    dueDate: "2024-01-17",
    comments: [
      { author: "Agent IA", text: "Ticket créé automatiquement suite à l'alerte système.", time: "5 min" },
    ],
    attachments: [],
  },
  {
    id: "T-040",
    title: "Export CSV des contacts",
    description: "L'export CSV ne fonctionne pas pour les listes de plus de 1000 contacts.",
    category: "support",
    priority: "medium",
    status: "pending",
    assignedTo: "David Lambert",
    client: "David Koné",
    createdAt: "2024-01-15",
    dueDate: "2024-01-20",
    comments: [],
    attachments: [],
  },
  {
    id: "T-039",
    title: "Webhook ne se déclenche pas",
    description: "Le webhook configuré pour les événements Slack ne se déclenche pas.",
    category: "incident",
    priority: "high",
    status: "open",
    assignedTo: "Équipe Tech",
    client: "Amina Traoré",
    createdAt: "2024-01-14",
    dueDate: "2024-01-16",
    comments: [],
    attachments: [],
  },
  {
    id: "T-038",
    title: "Question sur la facturation",
    description: "Le client souhaite comprendre la différence entre les plans Business et Enterprise.",
    category: "commercial",
    priority: "low",
    status: "resolved",
    assignedTo: "Marie Dupont",
    client: "Romain Dubois",
    createdAt: "2024-01-13",
    dueDate: "2024-01-14",
    comments: [
      { author: "Marie Dupont", text: "Réponse envoyée par email avec comparatif des plans.", time: "1 j" },
    ],
    attachments: [],
  },
];

const MOCK_CHAT_HISTORY = {
  1: [
    { role: "ai",   text: "Bonjour Sophie ! Je suis PulsAI. Comment puis-je vous aider aujourd'hui ?", time: "10:02" },
    { role: "user", text: "Bonjour ! Je cherche un CRM pour mon équipe de 25 personnes.", time: "10:03" },
    { role: "ai",   text: "Parfait ! Avec une équipe de 25 personnes, notre plan Business est idéal. Il inclut des agents IA illimités, l'automation marketing et des analytics avancés. Voulez-vous que je vous présente les détails ?", time: "10:03" },
    { role: "user", text: "Oui, et quel est le délai de mise en place ?", time: "10:15" },
  ],
  2: [
    { role: "ai",   text: "Bonjour David ! Bienvenue sur PulsAI. Que puis-je faire pour vous ?", time: "09:45" },
    { role: "user", text: "Vous avez un essai gratuit ?", time: "09:46" },
  ],
  3: [
    { role: "ai",   text: "Bonjour Amina ! Je suis PulsAI. Comment puis-je vous aider ?", time: "09:12" },
    { role: "user", text: "Je voudrais comparer les plans.", time: "09:13" },
  ],
};

const AI_RESPONSES = [
  "Excellente question ! La mise en place prend généralement 48h. Notre équipe CSM vous accompagne pas à pas. Souhaitez-vous planifier un appel d'onboarding ?",
  "Bien sûr ! Notre plan Starter à 29€/mois convient aux petites équipes, le Business à 89€/mois est notre plus populaire. Lequel vous intéresse le plus ?",
  "Notre essai gratuit de 14 jours vous donne accès à toutes les fonctionnalités Business. Aucune carte requise. Voulez-vous créer votre compte maintenant ?",
  "Absolument ! PulsAI s'intègre avec Stripe, Zapier, Slack, HubSpot et 200+ outils. L'intégration prend moins de 5 minutes. Avez-vous un outil prioritaire ?",
  "Pour cette taille d'équipe, je recommande le plan Business avec le module automation. Le ROI moyen de nos clients est de 3,2x en 3 mois.",
];

const KPIS = [
  { label: "Conversations actives", value: 24,       delta: "+12%", Icon: IoChatbubblesOutline,   color: "blue"   },
  { label: "Tickets ouverts",       value: 8,        delta: "-3",   Icon: IoTicketOutline,         color: "yellow" },
  { label: "Taux de conversion",    value: "68%",    delta: "+5.2%",Icon: HiOutlineTrendingUp,     color: "green"  },
  { label: "Revenus ce mois",       value: "4 820€", delta: "+18%", Icon: HiOutlineCurrencyDollar, color: "purple" },
];

const NOTIFS = [
  { Icon: HiOutlineFire,      iconColor: "text-red-400",    text: "Sophie Martin — Score passé à 92",         time: "2 min" },
  { Icon: IoTicketOutline,    iconColor: "text-[#3590E3]",  text: "Nouveau ticket haute priorité T-041",      time: "5 min" },
  { Icon: MdOutlinePayment,   iconColor: "text-[#BAF09D]",  text: "Paiement reçu — Amina Traoré 89€",        time: "1 h"   },
  { Icon: IoFlashOutline,     iconColor: "text-yellow-400", text: "Séquence email J+1 terminée (142 envois)", time: "3 h"   },
];

const AUTOMATIONS = [
  { Icon: HiOutlineMail,           title: "Séquence Email J+1",       status: "active", runs: 142 },
  { Icon: HiOutlineRefresh,        title: "Relance panier abandonné",  status: "active", runs: 67  },
  { Icon: HiOutlineClipboardList,  title: "Qualification automatique", status: "paused", runs: 0   },
];

const QUICK_ACTIONS = [
  { Icon: HiOutlineClipboardList, label: "Créer un ticket"  },
  { Icon: HiOutlineMail,          label: "Séquence email"   },
  { Icon: HiOutlineCreditCard,    label: "Lien paiement"    },
  { Icon: HiOutlineCalendar,      label: "Planifier appel"  },
];

/* ══════════════════════════════════════════════════════════════
   ATOMS
══════════════════════════════════════════════════════════════ */
function ScoreBadge({ score }) {
  const cls = score >= 85
    ? "text-[#BAF09D] bg-[#BAF09D]/10 border-[#BAF09D]/25"
    : score >= 65
    ? "text-yellow-300 bg-yellow-300/10 border-yellow-300/25"
    : "text-white/40 bg-white/5 border-white/10";
  return <span className={`text-[0.65rem] font-unbounded font-bold px-2 py-0.5 rounded-full border ${cls}`}>{score}</span>;
}

function Avatar({ initials, size = "sm", gradient = false }) {
  const sz = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-12 h-12 text-base" }[size];
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-unbounded font-bold shrink-0
      ${gradient ? "bg-gradient-to-br from-[#3590E3] to-[#BAF09D] text-[#0B0F1A]" : "bg-[#3590E3]/20 text-[#3590E3] border border-[#3590E3]/30"}`}>
      {initials}
    </div>
  );
}

function FunnelBar({ label, count, max, color }) {
  const [w, setW] = useState(0);
  useEffect(() => { setTimeout(() => setW((count / max) * 100), 300); }, []);
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 w-24 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${w}%`, background: color }} />
      </div>
      <span className="text-xs font-unbounded font-bold text-white/60 w-6 text-right">{count}</span>
    </div>
  );
}

function TicketRow({ ticket, onClick, onEdit, onDelete }) {
  const priority = {
    high:   "bg-red-400/10 text-red-400 border-red-400/25",
    medium: "bg-yellow-400/10 text-yellow-400 border-yellow-400/25",
    low:    "bg-white/5 text-white/35 border-white/10",
    urgent: "bg-red-600/20 text-red-300 border-red-600/30",
  }[ticket.priority] || "bg-white/5 text-white/35 border-white/10";

  const statusCfg = {
    open:        { cls: "bg-[#3590E3]/10 text-[#3590E3]",   label: "Ouvert",     Icon: IoAlertCircleOutline     },
    pending:     { cls: "bg-yellow-400/10 text-yellow-400", label: "En attente", Icon: IoTimeOutline             },
    "in-progress":{ cls: "bg-purple-400/10 text-purple-400", label: "En cours",  Icon: IoTimeOutline             },
    resolved:    { cls: "bg-[#BAF09D]/10 text-[#BAF09D]",   label: "Résolu",     Icon: IoCheckmarkCircleOutline  },
    closed:      { cls: "bg-white/5 text-white/30",          label: "Fermé",      Icon: IoCheckmarkCircleOutline  },
  }[ticket.status] || { cls: "bg-white/5 text-white/30", label: ticket.status, Icon: IoAlertCircleOutline };

  return (
    <div
      onClick={() => onClick && onClick(ticket)}
      className="flex items-center gap-4 py-3 border-b border-white/[0.05] last:border-0 hover:bg-white/[0.02] px-2 -mx-2 rounded-xl transition-colors cursor-pointer group"
    >
      <span className="font-mono text-xs text-white/25 w-12 shrink-0">{ticket.id}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white/80 truncate group-hover:text-white transition-colors">{ticket.title}</p>
        <p className="text-[0.65rem] text-white/30 mt-0.5">{ticket.client} · {ticket.assignedTo}</p>
      </div>
      <span className={`text-[0.6rem] font-semibold px-2 py-0.5 rounded-full border hidden sm:inline ${priority}`}>{ticket.priority}</span>
      <span className={`flex items-center gap-1 text-[0.65rem] font-medium px-2 py-1 rounded-lg ${statusCfg.cls}`}>
        <statusCfg.Icon size={11} />{statusCfg.label}
      </span>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
          {onEdit && (
            <button onClick={() => onEdit(ticket)} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-[#3590E3]/20 hover:text-[#3590E3] text-white/30 flex items-center justify-center transition-all">
              <IoPencilOutline size={12} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(ticket.id)} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-red-400/20 hover:text-red-400 text-white/30 flex items-center justify-center transition-all">
              <IoTrashOutline size={12} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, value, delta, Icon, color, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), index * 100); }, [index]);

  const maps = {
    border:    { blue: "border-[#3590E3]/20 hover:border-[#3590E3]/50", green: "border-[#BAF09D]/20 hover:border-[#BAF09D]/50", yellow: "border-yellow-400/20 hover:border-yellow-400/50", purple: "border-purple-400/20 hover:border-purple-400/50" },
    glow:      { blue: "from-[#3590E3]/8",   green: "from-[#BAF09D]/8",  yellow: "from-yellow-400/8", purple: "from-purple-400/8" },
    iconColor: { blue: "text-[#3590E3]",     green: "text-[#BAF09D]",    yellow: "text-yellow-400",   purple: "text-purple-400"  },
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br ${maps.glow[color]} to-transparent p-5 transition-all duration-500 cursor-default ${maps.border[color]} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center ${maps.iconColor[color]}`}>
          <Icon size={18} />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${delta.startsWith("+") ? "bg-[#BAF09D]/15 text-[#BAF09D]" : "bg-red-400/15 text-red-400"}`}>{delta}</span>
      </div>
      <div className="font-unbounded font-black text-2xl text-white tracking-tight">{value}</div>
      <div className="text-xs text-white/40 mt-1">{label}</div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-[#3590E3]/20 border border-[#3590E3]/30 flex items-center justify-center shrink-0">
        <TbRobot size={14} className="text-[#3590E3]" />
      </div>
      <div className="flex gap-1 items-center px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/[0.08]">
        {[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#3590E3]/60 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />)}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TICKET MODAL (Create / Edit)
══════════════════════════════════════════════════════════════ */
const EMPTY_TICKET = {
  title: "",
  description: "",
  category: "support",
  priority: "medium",
  status: "open",
  assignedTo: "",
  client: "",
  createdAt: new Date().toISOString().split("T")[0],
  dueDate: "",
  comments: [],
  attachments: [],
};

function TicketModal({ ticket, onClose, onSave }) {
  const [form, setForm] = useState(ticket ? { ...ticket } : { ...EMPTY_TICKET });
  const [newComment, setNewComment] = useState("");
  const isEdit = !!ticket;

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const addComment = () => {
    if (!newComment.trim()) return;
    setForm(f => ({
      ...f,
      comments: [...f.comments, { author: MOCK_USER.name, text: newComment.trim(), time: "À l'instant" }],
    }));
    setNewComment("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm(f => ({ ...f, attachments: [...f.attachments, ...files.map(fl => fl.name)] }));
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#3590E3]/50 transition-all";
  const labelCls = "text-[0.65rem] font-medium text-white/40 mb-1.5 block";

  const CATEGORIES = ["support","incident","demande interne","commercial"];
  const PRIORITIES  = ["basse","moyenne","haute","urgente"];
  const STATUSES    = ["ouvert","en cours","résolu","fermé"];

  const categoryVal = { support:"support", incident:"incident", "demande interne":"demande interne", commercial:"commercial" };
  const priorityVal  = { low:"basse", medium:"moyenne", high:"haute", urgent:"urgente" };
  const priorityKey  = { basse:"low", moyenne:"medium", haute:"high", urgente:"urgent" };
  const statusVal    = { open:"ouvert", "in-progress":"en cours", resolved:"résolu", closed:"fermé" };
  const statusKey    = { ouvert:"open", "en cours":"in-progress", résolu:"resolved", fermé:"closed" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-2xl bg-[#111827] border border-white/[0.09] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <IoTicketOutline size={16} className="text-[#3590E3]" />
            <h2 className="font-unbounded font-semibold text-sm text-white">{isEdit ? `Modifier ${form.id}` : "Nouveau ticket"}</h2>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/30 hover:text-white transition-all">
            <IoCloseOutline size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Titre */}
          <div>
            <label className={labelCls}>Titre / Objet du ticket *</label>
            <input className={inputCls} placeholder="Ex: Problème d'intégration Stripe…" value={form.title} onChange={e => set("title", e.target.value)} />
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description / Détails du problème</label>
            <textarea className={`${inputCls} resize-none`} rows={4} placeholder="Décrivez le problème ou la demande en détail…" value={form.description} onChange={e => set("description", e.target.value)} />
          </div>

          {/* Row: Catégorie + Priorité */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Catégorie / Type</label>
              <select className={`${inputCls} cursor-pointer`} value={form.category} onChange={e => set("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#111827" }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Priorité</label>
              <select className={`${inputCls} cursor-pointer`} value={priorityVal[form.priority] || form.priority} onChange={e => set("priority", priorityKey[e.target.value] || e.target.value)}>
                {PRIORITIES.map(p => <option key={p} value={p} style={{ background: "#111827" }}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          {/* Row: Statut + Assigné à */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Statut</label>
              <select className={`${inputCls} cursor-pointer`} value={statusVal[form.status] || form.status} onChange={e => set("status", statusKey[e.target.value] || e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s} style={{ background: "#111827" }}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Assigné à (agent / équipe)</label>
              <input className={inputCls} placeholder="Ex: Équipe Tech, Marie Dupont…" value={form.assignedTo} onChange={e => set("assignedTo", e.target.value)} />
            </div>
          </div>

          {/* Row: Client + Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Client / Contact associé</label>
              <input className={inputCls} placeholder="Ex: Sophie Martin…" value={form.client} onChange={e => set("client", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Date de création</label>
              <input type="date" className={inputCls} value={form.createdAt} onChange={e => set("createdAt", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Date d'échéance</label>
              <input type="date" className={inputCls} value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
            </div>
          </div>

          {/* Pièces jointes */}
          <div>
            <label className={labelCls}>Pièces jointes</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/40 hover:text-[#3590E3] transition-colors px-3 py-2 rounded-xl border border-white/[0.08] hover:border-[#3590E3]/40 bg-white/[0.03]">
                <IoAttachOutline size={14} /> Ajouter un fichier
                <input type="file" multiple className="hidden" onChange={handleFileChange} />
              </label>
              {form.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {form.attachments.map((name, i) => (
                    <span key={i} className="flex items-center gap-1.5 text-[0.65rem] px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50">
                      <IoAttachOutline size={10} />{name}
                      <button onClick={() => setForm(f => ({ ...f, attachments: f.attachments.filter((_, j) => j !== i) }))} className="ml-0.5 text-white/25 hover:text-red-400 transition-colors">
                        <IoCloseOutline size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Commentaires */}
          <div>
            <label className={labelCls}>Commentaires / Historique d'interaction</label>
            {form.comments.length > 0 && (
              <div className="mb-3 space-y-2">
                {form.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-6 h-6 rounded-full bg-[#3590E3]/20 border border-[#3590E3]/30 flex items-center justify-center shrink-0 text-[0.55rem] font-unbounded font-bold text-[#3590E3]">
                      {c.author.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[0.65rem] font-medium text-white/60">{c.author}</span>
                        <span className="text-[0.6rem] text-white/20">{c.time}</span>
                      </div>
                      <p className="text-xs text-white/50">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-end gap-2">
              <textarea className={`${inputCls} flex-1 resize-none`} rows={2} placeholder="Ajouter un commentaire…" value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button onClick={addComment} disabled={!newComment.trim()} className="w-9 h-9 rounded-xl bg-[#3590E3]/20 hover:bg-[#3590E3]/30 text-[#3590E3] flex items-center justify-center transition-all disabled:opacity-30 shrink-0">
                <IoChatbubbleOutline size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] shrink-0">
          <button onClick={onClose} className="text-xs px-4 py-2 rounded-xl border border-white/[0.08] text-white/40 hover:text-white/70 hover:border-white/20 transition-all">
            Annuler
          </button>
          <button onClick={handleSave} disabled={!form.title.trim()} className="flex items-center gap-2 text-xs px-5 py-2 rounded-xl bg-[#3590E3] text-white hover:bg-[#2a7fd4] disabled:opacity-40 disabled:cursor-not-allowed transition-all font-medium">
            {isEdit ? <IoPencilOutline size={13} /> : <IoAddOutline size={13} />}
            {isEdit ? "Enregistrer" : "Créer le ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TICKET DETAIL PANEL
══════════════════════════════════════════════════════════════ */
function TicketDetailPanel({ ticket, onClose, onEdit, onDelete }) {
  const priorityCfg = {
    high:   { cls: "bg-red-400/10 text-red-400 border-red-400/25",     label: "Haute" },
    medium: { cls: "bg-yellow-400/10 text-yellow-400 border-yellow-400/25", label: "Moyenne" },
    low:    { cls: "bg-white/5 text-white/35 border-white/10",          label: "Basse" },
    urgent: { cls: "bg-red-600/20 text-red-300 border-red-600/30",      label: "Urgente" },
  }[ticket.priority] || { cls: "bg-white/5 text-white/35 border-white/10", label: ticket.priority };

  const statusCfg = {
    open:        { cls: "bg-[#3590E3]/10 text-[#3590E3]",   label: "Ouvert",   Icon: IoAlertCircleOutline    },
    pending:     { cls: "bg-yellow-400/10 text-yellow-400", label: "En attente",Icon: IoTimeOutline           },
    "in-progress":{ cls: "bg-purple-400/10 text-purple-400",label: "En cours",  Icon: IoTimeOutline           },
    resolved:    { cls: "bg-[#BAF09D]/10 text-[#BAF09D]",   label: "Résolu",   Icon: IoCheckmarkCircleOutline },
    closed:      { cls: "bg-white/5 text-white/30",          label: "Fermé",    Icon: IoCheckmarkCircleOutline },
  }[ticket.status] || { cls: "bg-white/5 text-white/30", label: ticket.status, Icon: IoAlertCircleOutline };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="w-full max-w-lg bg-[#111827] border border-white/[0.09] rounded-2xl shadow-2xl flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-white/30">{ticket.id}</span>
            <span className="text-white/10">·</span>
            <span className={`flex items-center gap-1 text-[0.65rem] font-medium px-2 py-1 rounded-lg ${statusCfg.cls}`}>
              <statusCfg.Icon size={11} />{statusCfg.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(ticket)} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-[#3590E3]/20 hover:text-[#3590E3] text-white/30 flex items-center justify-center transition-all">
              <IoPencilOutline size={12} />
            </button>
            <button onClick={() => { onDelete(ticket.id); onClose(); }} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-red-400/20 hover:text-red-400 text-white/30 flex items-center justify-center transition-all">
              <IoTrashOutline size={12} />
            </button>
            <button onClick={onClose} className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white/30 hover:text-white transition-all">
              <IoCloseOutline size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <h3 className="font-medium text-base text-white leading-snug">{ticket.title}</h3>
            {ticket.description && <p className="text-xs text-white/40 mt-2 leading-relaxed">{ticket.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Catégorie", value: ticket.category },
              { label: "Priorité", value: priorityCfg.label, highlight: true, cls: priorityCfg.cls },
              { label: "Assigné à", value: ticket.assignedTo || "—" },
              { label: "Client", value: ticket.client || "—" },
              { label: "Créé le", value: ticket.createdAt || "—" },
              { label: "Échéance", value: ticket.dueDate || "—" },
            ].map(({ label, value, highlight, cls }) => (
              <div key={label} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                <p className="text-[0.6rem] text-white/25 mb-1">{label}</p>
                {highlight ? (
                  <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full border ${cls}`}>{value}</span>
                ) : (
                  <p className="text-xs text-white/60 font-medium">{value}</p>
                )}
              </div>
            ))}
          </div>

          {ticket.attachments?.length > 0 && (
            <div>
              <p className="text-[0.65rem] font-medium text-white/25 mb-2">Pièces jointes</p>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((name, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[0.65rem] px-2 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-white/50">
                    <IoAttachOutline size={10} />{name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {ticket.comments?.length > 0 && (
            <div>
              <p className="text-[0.65rem] font-medium text-white/25 mb-2">Historique</p>
              <div className="space-y-2">
                {ticket.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="w-6 h-6 rounded-full bg-[#3590E3]/20 border border-[#3590E3]/30 flex items-center justify-center shrink-0 text-[0.55rem] font-unbounded font-bold text-[#3590E3]">
                      {c.author.split(" ").map(w => w[0]).join("").slice(0,2)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[0.65rem] font-medium text-white/60">{c.author}</span>
                        <span className="text-[0.6rem] text-white/20">{c.time}</span>
                      </div>
                      <p className="text-xs text-white/50">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════════ */
const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",     Icon: RiDashboardLine       },
  { id: "conversations", label: "Conversations", Icon: IoChatbubblesOutline, badge: 3 },
  { id: "tickets",       label: "Tickets",       Icon: IoTicketOutline,      badge: 8 },
  { id: "automation",    label: "Automation",    Icon: IoFlashOutline        },
  { id: "analytics",     label: "Analytics",     Icon: IoBarChartOutline     },
  { id: "contacts",      label: "Contacts",      Icon: IoPeopleOutline       },
  { id: "settings",      label: "Paramètres",    Icon: IoSettingsOutline     },
];

function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  return (
    <aside className={`flex flex-col h-screen border-r border-white/[0.06] bg-[#0d1220] transition-all duration-300 shrink-0 z-30 ${collapsed ? "w-16" : "w-56"}`}>
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
        {!collapsed && (
          <span className="font-unbounded font-black text-lg bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent tracking-tight">
            PulsAI
          </span>
        )}
        <button onClick={() => setCollapsed(v => !v)} className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all shrink-0">
          {collapsed ? <IoChevronForwardOutline size={14} /> : <IoChevronBackOutline size={14} />}
        </button>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            title={collapsed ? label : ""}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all relative
              ${activeView === id ? "bg-[#3590E3]/15 text-[#3590E3]" : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]"}`}
          >
            <Icon size={18} className="shrink-0" />
            {!collapsed && <span className="text-[0.8rem] font-medium flex-1">{label}</span>}
            {!collapsed && badge && <span className="text-[0.6rem] font-unbounded font-bold bg-[#3590E3] text-white rounded-full w-4 h-4 flex items-center justify-center">{badge}</span>}
            {collapsed && badge && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#3590E3] rounded-full" />}
          </button>
        ))}
      </nav>

      <div className={`border-t border-white/[0.06] p-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <Avatar initials={MOCK_USER.avatar} gradient />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-white/80 truncate">{MOCK_USER.name}</p>
            <p className="text-[0.65rem] text-white/30 truncate">{MOCK_USER.plan}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ══════════════════════════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════════════════════════ */
function Topbar({ activeView }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const labels = { dashboard: "Dashboard", conversations: "Conversations IA", tickets: "Gestion des tickets", automation: "Automation marketing", analytics: "Analytics", contacts: "Contacts & CRM", settings: "Paramètres" };

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#0d1220]/60 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <h2 className="font-unbounded font-bold text-sm text-white tracking-tight">{labels[activeView]}</h2>
        <span className="text-white/15">·</span>
        <span className="text-xs text-white/25">{new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <input type="text" placeholder="Recherche rapide…" className="bg-white/[0.04] border border-white/[0.07] rounded-xl pl-8 pr-4 py-1.5 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#3590E3]/40 transition-all w-48" />
          <IoSearchOutline size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/25" />
        </div>

        <div className="relative">
          <button onClick={() => setNotifOpen(v => !v)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all relative">
            <IoNotificationsOutline size={17} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#3590E3] rounded-full border border-[#0d1220]" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-[#141922] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <p className="text-xs font-unbounded font-semibold text-white">Notifications</p>
                <button onClick={() => setNotifOpen(false)} className="text-white/30 hover:text-white transition-colors"><IoCloseOutline size={16} /></button>
              </div>
              {NOTIFS.map((n, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.04] cursor-pointer border-b border-white/[0.04] last:border-0 transition-colors">
                  <n.Icon size={15} className={`mt-0.5 shrink-0 ${n.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white/70 leading-snug">{n.text}</p>
                    <p className="text-[0.6rem] text-white/25 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Avatar initials={MOCK_USER.avatar} gradient />
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD HOME
══════════════════════════════════════════════════════════════ */
function DashboardHome({ setActiveView, setSelectedConv }) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-unbounded font-black text-2xl tracking-tight text-white">Bonjour, {MOCK_USER.name.split(" ")[0]}</h1>
          <p className="text-sm text-white/40 mt-1">Voici ce qui se passe aujourd'hui sur PulsAI.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/30 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#BAF09D] animate-pulse" />
          IA active · 24 conv.
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {KPIS.map((kpi, i) => <KpiCard key={kpi.label} {...kpi} index={i} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiOutlineFire size={16} className="text-red-400" />
              <h2 className="font-unbounded font-semibold text-sm text-white">Conversations chaudes</h2>
            </div>
            <button onClick={() => setActiveView("conversations")} className="text-xs text-[#3590E3] hover:underline">Voir tout →</button>
          </div>
          <div className="space-y-1">
            {MOCK_CONVERSATIONS.filter(c => c.status !== "cold").slice(0, 4).map(conv => (
              <div key={conv.id} onClick={() => { setSelectedConv(conv.id); setActiveView("conversations"); }} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all group">
                <div className="relative">
                  <Avatar initials={conv.avatar} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d1220] ${conv.status === "hot" ? "bg-red-400" : "bg-yellow-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{conv.name}</span>
                    <ScoreBadge score={conv.score} />
                  </div>
                  <p className="text-xs text-white/35 truncate mt-0.5">{conv.lastMsg}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[0.65rem] text-white/25">{conv.time}</p>
                  {conv.unread > 0 && <span className="inline-flex mt-1 w-4 h-4 rounded-full bg-[#3590E3] text-white text-[0.55rem] font-bold items-center justify-center">{conv.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <HiOutlineChip size={15} className="text-[#3590E3]" />
            <h2 className="font-unbounded font-semibold text-sm text-white">Pipeline IA</h2>
          </div>
          <div className="space-y-4">
            <FunnelBar label="Prospection"  count={42} max={42} color="#3590E3" />
            <FunnelBar label="Qualification" count={28} max={42} color="#5aaaf0" />
            <FunnelBar label="Découverte"   count={18} max={42} color="#BAF09D" />
            <FunnelBar label="Négociation"  count={11} max={42} color="#8ef06e" />
            <FunnelBar label="Conversion"   count={6}  max={42} color="#28CA41" />
          </div>
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex justify-between text-xs">
            <span className="text-white/35">Taux global</span>
            <span className="font-unbounded font-bold text-[#BAF09D]">14.3%</span>
          </div>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <IoTicketOutline size={15} className="text-[#3590E3]" />
            <h2 className="font-unbounded font-semibold text-sm text-white">Tickets récents</h2>
          </div>
          <button onClick={() => setActiveView("tickets")} className="text-xs text-[#3590E3] hover:underline">Voir tout →</button>
        </div>
        {INITIAL_TICKETS.map(t => <TicketRow key={t.id} ticket={t} />)}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AUTOMATIONS.map(({ Icon, title, status, runs }) => (
          <div key={title} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-4 hover:border-white/[0.12] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#3590E3]/10 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-[#3590E3]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white/75 truncate">{title}</p>
              <p className="text-[0.65rem] text-white/30 mt-0.5">{runs} exécutions</p>
            </div>
            <span className={`text-[0.6rem] font-semibold px-2 py-1 rounded-lg ${status === "active" ? "bg-[#BAF09D]/10 text-[#BAF09D]" : "bg-white/5 text-white/30"}`}>
              {status === "active" ? "Actif" : "Pausé"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   CONVERSATIONS VIEW
══════════════════════════════════════════════════════════════ */
function ConversationsView({ selectedConv, setSelectedConv }) {
  const [messages, setMessages]   = useState(MOCK_CHAT_HISTORY[selectedConv] || []);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState(false);
  const [handedOff, setHandedOff] = useState(false);
  const messagesEndRef            = useRef(null);

  useEffect(() => { setMessages(MOCK_CHAT_HISTORY[selectedConv] || []); setHandedOff(false); }, [selectedConv]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const activeConv = MOCK_CONVERSATIONS.find(c => c.id === selectedConv) || MOCK_CONVERSATIONS[0];

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    setMessages(m => [...m, { role: "agent", text: input.trim(), time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }) }]);
    setInput(""); setTyping(true);
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 600));
    setTyping(false);
    setMessages(m => [...m, { role: "ai", text: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)], time: new Date().toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }) }]);
  }, [input]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* List */}
      <div className="w-72 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <input type="text" placeholder="Rechercher…" className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-white/25 outline-none focus:border-[#3590E3]/50 transition-all" />
            <IoSearchOutline size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {MOCK_CONVERSATIONS.map(conv => (
            <button key={conv.id} onClick={() => setSelectedConv(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.04] transition-all ${selectedConv === conv.id ? "bg-[#3590E3]/10 border-r-2 border-[#3590E3]" : ""}`}>
              <div className="relative shrink-0">
                <Avatar initials={conv.avatar} />
                <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#0d1220] ${conv.status === "hot" ? "bg-red-400" : conv.status === "warm" ? "bg-yellow-400" : "bg-white/20"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-white/80 truncate">{conv.name}</span>
                  <span className="text-[0.6rem] text-white/25 shrink-0 ml-1">{conv.time}</span>
                </div>
                <p className="text-[0.65rem] text-white/30 truncate mt-0.5">{conv.lastMsg}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[0.55rem] text-white/20">{conv.stage}</span>
                  <ScoreBadge score={conv.score} />
                </div>
              </div>
              {conv.unread > 0 && <span className="shrink-0 w-4 h-4 rounded-full bg-[#3590E3] text-white text-[0.55rem] font-bold flex items-center justify-center">{conv.unread}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <Avatar initials={activeConv.avatar} size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-white">{activeConv.name}</span>
                <ScoreBadge score={activeConv.score} />
                <span className={`flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full font-medium ${activeConv.status === "hot" ? "bg-red-400/10 text-red-400" : "bg-yellow-400/10 text-yellow-400"}`}>
                  <HiOutlineFire size={10} />
                  {activeConv.status === "hot" ? "Chaud" : "Tiède"}
                </span>
              </div>
              <p className="text-[0.65rem] text-white/35">{activeConv.email} · {activeConv.stage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!handedOff ? (
              <>
                <div className="flex items-center gap-1.5 bg-[#BAF09D]/10 border border-[#BAF09D]/25 rounded-lg px-3 py-1.5">
                  <TbRobot size={13} className="text-[#BAF09D]" />
                  <span className="text-[0.65rem] text-[#BAF09D] font-medium">IA Pilote</span>
                </div>
                <button onClick={() => setHandedOff(true)} className="flex items-center gap-1.5 text-[0.65rem] px-3 py-1.5 rounded-lg border border-white/10 text-white/40 hover:border-[#3590E3]/40 hover:text-[#3590E3] transition-all">
                  <MdOutlineSupportAgent size={13} /> Prendre la main
                </button>
              </>
            ) : (
              <div className="flex items-center gap-1.5 bg-[#3590E3]/10 border border-[#3590E3]/25 rounded-lg px-3 py-1.5">
                <MdOutlineSupportAgent size={13} className="text-[#3590E3]" />
                <span className="text-[0.65rem] text-[#3590E3] font-medium">Agent humain</span>
              </div>
            )}
            <button className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-all">
              <IoEllipsisHorizontal size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {messages.map((msg, i) => {
            const isAI = msg.role === "ai", isAgent = msg.role === "agent", isUser = msg.role === "user";
            return (
              <div key={i} className={`flex items-end gap-2 mb-3 ${isUser ? "justify-end" : "justify-start"}`}>
                {(isAI || isAgent) && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isAI ? "bg-[#3590E3]/20 border border-[#3590E3]/30" : "bg-[#BAF09D]/20 border border-[#BAF09D]/30"}`}>
                    {isAI ? <TbRobot size={14} className="text-[#3590E3]" /> : <MdOutlineSupportAgent size={14} className="text-[#BAF09D]" />}
                  </div>
                )}
                <div className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[0.82rem] leading-relaxed
                  ${isAI ? "bg-white/[0.06] border border-white/[0.08] text-white/80 rounded-bl-sm"
                  : isAgent ? "bg-[#3590E3]/15 border border-[#3590E3]/20 text-white/80 rounded-bl-sm"
                  : "bg-[#BAF09D]/10 border border-[#BAF09D]/15 text-white/80 rounded-br-sm"}`}>
                  {msg.text}
                  <p className="text-[0.6rem] text-white/20 mt-1 text-right">{msg.time}</p>
                </div>
                {isUser && <Avatar initials={activeConv.avatar} />}
              </div>
            );
          })}
          {typing && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {activeConv.score >= 80 && !handedOff && (
          <div className="mx-5 mb-3 p-3 rounded-xl bg-[#BAF09D]/8 border border-[#BAF09D]/20 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#BAF09D]/15 flex items-center justify-center shrink-0">
              <HiOutlineCreditCard size={16} className="text-[#BAF09D]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#BAF09D]">Lead prêt à convertir</p>
              <p className="text-[0.65rem] text-white/35">Score {activeConv.score}/100 · Envoyer un lien de paiement</p>
            </div>
            <button className="shrink-0 flex items-center gap-1.5 text-[0.7rem] font-semibold px-3 py-1.5 rounded-lg bg-[#BAF09D]/20 text-[#BAF09D] hover:bg-[#BAF09D]/30 transition-all">
              Envoyer <IoSendOutline size={11} />
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/[0.06] bg-white/[0.02]">
          <div className="flex items-end gap-3">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={handedOff ? "Répondez en tant qu'agent humain…" : "Répondez ou laissez l'IA gérer…"} rows={1}
              className="flex-1 bg-white/[0.05] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:border-[#3590E3]/50 transition-all resize-none leading-snug"
              style={{ minHeight: "44px", maxHeight: "120px" }} />
            <button onClick={sendMessage} disabled={!input.trim()} className="w-10 h-10 rounded-xl bg-[#3590E3] hover:bg-[#2a7fd4] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all hover:shadow-lg hover:shadow-blue-500/25 shrink-0">
              <BsArrowUpShort size={22} className="text-white" />
            </button>
          </div>
          <p className="text-[0.6rem] text-white/15 mt-2 text-center">Entrée pour envoyer · L'IA prend le relais automatiquement</p>
        </div>
      </div>

      <div className="hidden xl:flex w-64 shrink-0 border-l border-white/[0.06] flex-col p-4 gap-4 overflow-y-auto">
        <div className="text-center py-3">
          <Avatar initials={activeConv.avatar} size="lg" gradient />
          <p className="font-medium text-sm text-white mt-3">{activeConv.name}</p>
          <p className="text-[0.65rem] text-white/35 mt-0.5">{activeConv.email}</p>
        </div>
        <div className="space-y-1">
          {[
            { label: "Score IA", value: `${activeConv.score}/100`, highlight: true },
            { label: "Étape",    value: activeConv.stage },
            { label: "Statut",   value: activeConv.status === "hot" ? "Chaud" : "Tiède" },
            { label: "Contact",  value: activeConv.time },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.05] last:border-0">
              <span className="text-[0.7rem] text-white/30">{label}</span>
              <span className={`text-[0.7rem] font-medium ${highlight ? "text-[#BAF09D]" : "text-white/60"}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-[0.65rem] font-unbounded font-semibold text-white/25 tracking-wider uppercase mb-2">Actions rapides</p>
          {QUICK_ACTIONS.map(({ Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-2.5 text-[0.72rem] text-white/45 hover:text-white/75 py-2 px-3 rounded-lg hover:bg-white/[0.05] transition-all">
              <Icon size={13} className="shrink-0" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   PLACEHOLDER
══════════════════════════════════════════════════════════════ */
function PlaceholderView({ title, description, Icon }) {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-2xl bg-[#3590E3]/10 border border-[#3590E3]/20 flex items-center justify-center mx-auto mb-5">
          <Icon size={28} className="text-[#3590E3]" />
        </div>
        <h2 className="font-unbounded font-black text-xl text-white mb-2">{title}</h2>
        <p className="text-sm text-white/40 leading-relaxed">{description}</p>
        <div className="mt-6 inline-flex items-center gap-2 text-xs text-[#3590E3] bg-[#3590E3]/10 border border-[#3590E3]/20 px-4 py-2 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3590E3] animate-pulse" />
          Vue en cours de développement
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   TICKETS VIEW (FULL CRUD)
══════════════════════════════════════════════════════════════ */
let ticketCounter = 42;

function TicketsView() {
  const [tickets, setTickets]           = useState(INITIAL_TICKETS);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [detailTicket, setDetailTicket] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch]             = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const openCreate = () => { setEditingTicket(null); setModalOpen(true); };
  const openEdit   = (t)  => { setEditingTicket(t);  setModalOpen(true); setDetailTicket(null); };

  const handleSave = (form) => {
    if (editingTicket) {
      setTickets(ts => ts.map(t => t.id === form.id ? { ...form } : t));
    } else {
      ticketCounter++;
      const newId = `T-0${ticketCounter}`;
      setTickets(ts => [{ ...form, id: newId }, ...ts]);
    }
    setModalOpen(false);
    setEditingTicket(null);
  };

  const handleDelete = (id) => {
    setTickets(ts => ts.filter(t => t.id !== id));
    setDeleteConfirm(null);
  };

  const filtered = tickets.filter(t => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false;
    if (filterPriority !== "all" && t.priority !== filterPriority) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.client?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusLabels = { all: "Tous", open: "Ouvert", pending: "En attente", "in-progress": "En cours", resolved: "Résolu", closed: "Fermé" };
  const priorityLabels = { all: "Toutes", low: "Basse", medium: "Moyenne", high: "Haute", urgent: "Urgente" };

  const stats = {
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress" || t.status === "pending").length,
    resolved: tickets.filter(t => t.status === "resolved" || t.status === "closed").length,
    high: tickets.filter(t => t.priority === "high" || t.priority === "urgent").length,
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IoTicketOutline size={20} className="text-[#3590E3]" />
          <h1 className="font-unbounded font-black text-xl text-white">Tickets</h1>
          <span className="text-[0.65rem] font-unbounded font-bold bg-[#3590E3]/20 text-[#3590E3] rounded-full px-2 py-0.5">{tickets.length}</span>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-[#3590E3] text-white hover:bg-[#2a7fd4] transition-all font-medium">
          <IoAddOutline size={16} /> Nouveau ticket
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Ouverts",     value: stats.open,       color: "text-[#3590E3]", bg: "bg-[#3590E3]/10 border-[#3590E3]/20" },
          { label: "En cours",    value: stats.inProgress,  color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20" },
          { label: "Résolus",     value: stats.resolved,    color: "text-[#BAF09D]", bg: "bg-[#BAF09D]/10 border-[#BAF09D]/20" },
          { label: "Haute prio.", value: stats.high,        color: "text-red-400",   bg: "bg-red-400/10 border-red-400/20" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-xl border p-3 ${bg}`}>
            <div className={`font-unbounded font-black text-xl ${color}`}>{value}</div>
            <div className="text-[0.65rem] text-white/35 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher un ticket…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-[#3590E3]/50 transition-all w-52"
          />
          <IoSearchOutline size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {Object.entries(statusLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`text-[0.65rem] px-2.5 py-1 rounded-lg transition-all font-medium ${filterStatus === key ? "bg-[#3590E3]/20 text-[#3590E3]" : "text-white/30 hover:text-white/60"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
          {Object.entries(priorityLabels).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterPriority(key)}
              className={`text-[0.65rem] px-2.5 py-1 rounded-lg transition-all font-medium ${filterPriority === key ? "bg-[#3590E3]/20 text-[#3590E3]" : "text-white/30 hover:text-white/60"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <IoTicketOutline size={32} className="text-white/10 mx-auto mb-3" />
            <p className="text-sm text-white/30">Aucun ticket trouvé</p>
          </div>
        ) : (
          filtered.map(t => (
            <TicketRow
              key={t.id}
              ticket={t}
              onClick={setDetailTicket}
              onEdit={openEdit}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {modalOpen && (
        <TicketModal
          ticket={editingTicket}
          onClose={() => { setModalOpen(false); setEditingTicket(null); }}
          onSave={handleSave}
        />
      )}

      {detailTicket && !modalOpen && (
        <TicketDetailPanel
          ticket={detailTicket}
          onClose={() => setDetailTicket(null)}
          onEdit={openEdit}
          onDelete={(id) => setDeleteConfirm(id)}
        />
      )}

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(11,15,26,0.9)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-sm bg-[#111827] border border-white/[0.09] rounded-2xl p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto mb-4">
              <IoTrashOutline size={20} className="text-red-400" />
            </div>
            <h3 className="font-unbounded font-semibold text-sm text-white text-center mb-2">Supprimer le ticket</h3>
            <p className="text-xs text-white/40 text-center mb-6">Cette action est irréversible. Le ticket sera définitivement supprimé.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 text-xs py-2.5 rounded-xl border border-white/[0.08] text-white/40 hover:text-white/70 transition-all">
                Annuler
              </button>
              <button onClick={() => { handleDelete(deleteConfirm); setDetailTicket(null); }} className="flex-1 text-xs py-2.5 rounded-xl bg-red-400/20 text-red-400 hover:bg-red-400/30 font-medium transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [activeView,   setActiveView]   = useState("dashboard");
  const [selectedConv, setSelectedConv] = useState(1);
  const [collapsed,    setCollapsed]    = useState(false);

  const renderView = () => {
    switch (activeView) {
      case "dashboard":     return <DashboardHome setActiveView={setActiveView} setSelectedConv={setSelectedConv} />;
      case "conversations": return <ConversationsView selectedConv={selectedConv} setSelectedConv={setSelectedConv} />;
      case "tickets":       return <TicketsView />;
      case "automation": return <PlaceholderView title="Automation"    Icon={IoFlashOutline}   description="Configurez vos séquences emails, workflows et déclencheurs automatiques." />;
      case "analytics":  return <PlaceholderView title="Analytics"     Icon={IoBarChartOutline} description="Visualisez vos KPIs, taux de conversion et performances de l'IA." />;
      case "contacts":   return <PlaceholderView title="Contacts & CRM" Icon={IoPeopleOutline}  description="Gérez votre base de contacts et enrichissez vos données clients." />;
      case "settings":   return <PlaceholderView title="Paramètres"    Icon={IoSettingsOutline} description="Configurez votre compte, intégrations, équipe et préférences IA." />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F1A] text-[#E8EDF5] overflow-hidden" style={{ fontFamily: "'Ubuntu', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Ubuntu:wght@300;400;500&display=swap');
        .font-unbounded { font-family: 'Unbounded', sans-serif !important; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>

      <Sidebar activeView={activeView} setActiveView={setActiveView} collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar activeView={activeView} />
        <main className="flex-1 flex overflow-hidden">{renderView()}</main>
      </div>
    </div>
  );
}