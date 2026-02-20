import { useEffect, useRef, useState, Ref } from "react";
import { 
  FiMessageCircle,
  FiBarChart2,
  FiZap,
  FiUsers,
  FiMail,
  FiLink,
  FiLock,
  FiCheck
} from "react-icons/fi";

import { HiSparkles } from "react-icons/hi";
import { FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoTicketOutline } from "react-icons/io5";

/* ─── Tiny hook for intersection observer fade-in ─── */
function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  options = {},
): [Ref<T>, boolean] {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, ...options },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Animated typing dots ─── */
function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 w-fit">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

/* ─── Counter animation ─── */
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useFadeIn();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, target]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ─── Feature card ─── */
interface FeatureCardProps {
 icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

function FeatureCard({ icon, title, desc, delay = 0 }: FeatureCardProps) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`p-8 transition-all duration-700 hover:bg-blue-500/5 cursor-default ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl mb-5">
        {icon}
      </div>
      <h3 className="font-unbounded font-semibold text-[0.95rem] tracking-tight text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Pricing card ─── */
function PricingCard({
  name,
  price,
  desc,
  features,
  featured = false,
  delay = 0,
}: {
  name: string;
  price: string;
  desc: string;
  features: string[];
  featured?: boolean;
  delay?: number;
}) {
  const [ref, visible] = useFadeIn();
  return (
    <div
      ref={ref}
      className={`relative rounded-2xl p-8 border transition-all duration-700 ${
        featured
          ? "border-[#3590E3] bg-[#3590E3]/8"
          : "border-white/8 bg-white/[0.03] hover:border-[#3590E3]/30"
      } hover:-translate-y-1 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {featured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3590E3] text-white text-[0.65rem] font-unbounded font-semibold px-3 py-1 rounded-full tracking-widest whitespace-nowrap">
          <HiSparkles className="inline mr-1" /> POPULAIRE
        </div>
      )}
      <div className="text-[0.7rem] font-unbounded font-semibold text-white/40 tracking-widest uppercase mb-3">
        {name}
      </div>
      <div className="font-unbounded font-black text-4xl tracking-tight mb-1">
        {price}
        <span className="text-base font-normal text-white/40">
          {typeof price === "string" && price !== "Sur" ? "/mois" : ""}
        </span>
      </div>
      <p className="text-sm text-white/40 mb-6">{desc}</p>
      <ul className="space-y-2 mb-8">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-center gap-2 text-sm text-white/65 border-b border-white/[0.04] pb-2 last:border-0"
          >
            <FiCheck className="text-[#BAF09D] font-bold text-xs" />
            {f}
          </li>
        ))}
      </ul>
      <Link
        to="/register"
        className={`block text-center py-3 rounded-xl text-sm font-medium transition-all ${
          featured
            ? "bg-[#3590E3] text-white hover:bg-[#2a7fd4] hover:shadow-lg hover:shadow-blue-500/25"
            : "border border-[#3590E3]/40 text-[#3590E3] hover:bg-[#3590E3]/10"
        }`}
      >
        Commencer →
      </Link>
    </div>
  );
}

/* ─── MAIN LANDING PAGE ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroVisible] = useFadeIn({ threshold: 0.05 });

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] font-ubuntu overflow-x-hidden">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(53,144,227,0.18)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(186,240,157,0.10)_0%,transparent_60%)]" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ─── NAV ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-16 py-5 transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0F1A]/80 backdrop-blur-xl border-b border-white/[0.06]"
            : ""
        }`}
      >
        <span className="font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent tracking-tight">
          PulsAI
        </span>
        <ul className="hidden md:flex gap-8 text-sm text-white/60">
          {["Fonctionnalités", "Comment ça marche", "Tarifs"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
                className="hover:text-white transition-colors"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-[#3590E3]/50 text-[#3590E3] text-sm font-medium hover:bg-[#3590E3]/10 transition-all"
          >
            Connexion
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] transition-all hover:shadow-lg hover:shadow-blue-500/30"
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-16"
      >
        <h1
          className={`font-unbounded font-black text-5xl md:text-7xl leading-[1.05] tracking-tight max-w-4xl transition-all duration-700 delay-100 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          Vendez plus vite. <span className="text-[#3590E3]">Automatisez</span>{" "}
          tout. <span className="text-[#BAF09D]">Clôturez</span> mieux.
        </h1>

        <p
          className={`text-lg text-white/50 max-w-xl mt-6 leading-relaxed font-light transition-all duration-700 delay-200 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          PulsAI combine IA conversationnelle, gestion de tickets et
          automatisation marketing pour transformer chaque conversation en
          opportunité de vente.
        </p>

        <div
          className={`flex flex-wrap gap-4 justify-center mt-10 transition-all duration-700 delay-300 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          <Link
            to="/register"
            className="px-8 py-4 rounded-xl bg-[#3590E3] text-white font-medium text-base hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-200"
          >
            Essai gratuit 14 jours →
          </Link>
          <a
            href="#comment-ça-marche"
            className="px-8 py-4 rounded-xl border border-white/15 text-white/70 font-light hover:border-white/35 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            Voir la démo
          </a>
        </div>

        {/* Metrics */}
        <div
          className={`flex gap-12 mt-16 flex-wrap justify-center transition-all duration-700 delay-500 ${
            heroVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          {[
            { val: 3.2, suffix: "x", label: "Taux de conversion" },
            { val: 80, suffix: "%", label: "Tickets automatisés" },
            { val: 24, suffix: "/7", label: "Support IA actif" },
          ].map(({ val, suffix, label }) => (
            <div key={label} className="text-center">
              <div className="font-unbounded font-black text-3xl bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
                <AnimatedCounter target={val} suffix={suffix} />
              </div>
              <div className="text-xs text-white/40 mt-1 tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CHAT PREVIEW ─── */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 mb-24">
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
          {/* Window bar */}
          <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.04] border-b border-white/[0.06]">
            {["bg-[#FF5F57]", "bg-[#FFBD2E]", "bg-[#28CA41]"].map((c, i) => (
              <span key={i} className={`w-3 h-3 rounded-full ${c}`} />
            ))}
            <span className="ml-3 text-xs text-white/20 font-mono">
              PulsAI — Conversation IA
            </span>
          </div>
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] min-h-[380px]">
            {/* Sidebar */}
            <div className="hidden md:block border-r border-white/[0.06] p-4 bg-white/[0.01]">
              <p className="text-[0.6rem] font-unbounded font-semibold text-white/25 tracking-widest mb-4 px-2">
                MENU
              </p>
              {[
                {
                  icon: <FiMessageCircle />,
                  label: "Conversations",
                  active: true,
                },
                { icon: < IoTicketOutline />, label: "Tickets" },
                { icon: <FiBarChart2 />, label: "Analytics" },
                { icon: <FiZap />, label: "Automation" },
                { icon: <FiUsers />, label: "CRM" },
              ].map(({ icon, label, active }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-xs cursor-pointer transition-colors ${
                    active
                      ? "bg-[#3590E3]/15 text-[#3590E3]"
                      : "text-white/35 hover:text-white/60"
                  }`}
                >
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
            {/* Chat */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-unbounded font-semibold text-sm">
                    Sophie Martin
                  </p>
                  <p className="text-xs text-white/35 mt-0.5">
                    Lead qualifié · Score 87/100
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-lg bg-[#BAF09D]/10 border border-[#BAF09D]/25 text-[#BAF09D]">
                  IA Activée
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {[
                  {
                    text: "Bonjour Sophie ! Je suis PulsAI, votre assistant commercial. Comment puis-je vous aider ?",
                    ai: true,
                  },
                  {
                    text: "Je cherche une solution CRM pour mon équipe de 20 personnes.",
                    ai: false,
                  },
                  {
                    text: "Parfait ! Notre plan Business est idéal. Il inclut workflows automatisés, rapports avancés et intégrations. Voulez-vous une démo personnalisée ?",
                    ai: true,
                  },
                  { text: "Oui, et quel est votre tarif ?", ai: false },
                ].map(({ text, ai }, i) => (
                  <div
                    key={i}
                    className={`max-w-[75%] px-4 py-3 rounded-xl text-[0.8rem] leading-relaxed text-white/80 ${
                      ai
                        ? "self-start bg-[#3590E3]/10 border border-[#3590E3]/20 rounded-tl-sm"
                        : "self-end bg-[#BAF09D]/8 border border-[#BAF09D]/15 rounded-tr-sm"
                    }`}
                  >
                    {text}
                  </div>
                ))}
                <TypingDots />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 h-px bg-white/[0.06] mx-8" />

      {/* ─── FEATURES ─── */}
      <section
        id="fonctionnalités"
        className="relative z-10 max-w-5xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <p className="text-[0.65rem] font-unbounded font-semibold text-[#3590E3] tracking-[0.2em] uppercase mb-3">
            Fonctionnalités
          </p>
          <h2 className="font-unbounded font-black text-4xl md:text-5xl tracking-tight leading-tight">
            Tout ce dont vous avez
            <br />
            besoin, en un seul endroit
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto">
            PulsAI réunit les outils essentiels d'un CRM moderne avec la
            puissance de l'IA.
          </p>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 border border-white/[0.06] rounded-2xl overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "1px 100%, 100% 1px",
          }}
        >
          {[
  { icon: <FaRobot />, title: "IA Conversationnelle", desc: "Engagez vos prospects 24h/24 avec une IA qui qualifie et convertit jusqu'à la signature.", delay: 0 },
  { icon: < IoTicketOutline />, title: "Gestion de Tickets", desc: "Centralisez et automatisez votre support. Routage intelligent et SLA respectés.", delay: 100 },
  { icon: <FiMail />, title: "Automation Marketing", desc: "Séquences personnalisées déclenchées par le comportement réel de vos contacts.", delay: 200 },
  { icon: <FiBarChart2 />, title: "Analytics Avancés", desc: "Dashboards temps réel, prévisions de revenus et insights actionnables.", delay: 0 },
  { icon: <FiLink />, title: "Intégrations Natives", desc: "Connectez Slack, Stripe, HubSpot, Zapier et 200+ applications.", delay: 100 },
  { icon: <FiLock />, title: "Sécurité Enterprise", desc: "Chiffrement end-to-end, RGPD, SSO et contrôle d'accès granulaire.", delay: 200 },
].map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      <div className="relative z-10 h-px bg-white/[0.06] mx-8" />

      {/* ─── HOW IT WORKS ─── */}
      <section
        id="comment-ça-marche"
        className="relative z-10 max-w-4xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <p className="text-[0.65rem] font-unbounded font-semibold text-[#3590E3] tracking-[0.2em] uppercase mb-3">
            Comment ça marche
          </p>
          <h2 className="font-unbounded font-black text-4xl md:text-5xl tracking-tight leading-tight">
            De la conversation
            <br />à la conversion
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-[#3590E3]/50 to-transparent" />
          {[
            {
              num: "01",
              title: "Capture",
              desc: "Le visiteur entre en contact via chat, email ou formulaire.",
            },
            {
              num: "02",
              title: "Qualification",
              desc: "L'IA analyse le profil et qualifie le lead en temps réel.",
            },
            {
              num: "03",
              title: "Nurturing",
              desc: "Séquences automatiques personnalisées jusqu'à la décision.",
            },
            {
              num: "04",
              title: "Conversion",
              desc: "Paiement sécurisé intégré directement dans la conversation.",
            },
          ].map(({ num, title, desc }, i) => {
            const [ref, visible] = useFadeIn();
            return (
              <div
                key={num}
                ref={ref}
                className={`text-center relative z-10 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-full bg-[#3590E3]/10 border border-[#3590E3]/30 flex items-center justify-center font-unbounded font-black text-[#3590E3] text-lg mx-auto mb-4">
                  {num}
                </div>
                <h4 className="font-unbounded font-semibold text-sm mb-2">
                  {title}
                </h4>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative z-10 h-px bg-white/[0.06] mx-8" />

      {/* ─── PRICING ─── */}
      <section
        id="tarifs"
        className="relative z-10 max-w-5xl mx-auto px-4 py-24"
      >
        <div className="text-center mb-16">
          <p className="text-[0.65rem] font-unbounded font-semibold text-[#3590E3] tracking-[0.2em] uppercase mb-3">
            Tarifs
          </p>
          <h2 className="font-unbounded font-black text-4xl md:text-5xl tracking-tight leading-tight">
            Simple. Transparent.
            <br />
            Sans surprise.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingCard
            name="Starter"
            price="29€"
            desc="Parfait pour démarrer"
            features={[
              "2 agents IA inclus",
              "500 conversations/mois",
              "Tickets basiques",
              "Rapports standards",
              "Support email",
            ]}
            delay={0}
          />
          <PricingCard
            name="Business"
            price="89€"
            desc="Pour les équipes en croissance"
            features={[
              "10 agents IA",
              "Conversations illimitées",
              "Automation marketing",
              "Analytics avancés",
              "Intégrations natives",
              "Support 24/7",
            ]}
            featured
            delay={100}
          />
          <PricingCard
            name="Enterprise"
            price="Sur mesure"
            desc="Pour les grandes organisations"
            features={[
              "Agents illimités",
              "SLA garanti",
              "SSO & SAML",
              "On-premise possible",
              "CSM dédié",
              "Formation incluse",
            ]}
            delay={200}
          />
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative z-10 max-w-2xl mx-auto px-4 pb-24">
        <div className="relative rounded-3xl border border-[#3590E3]/30 bg-[#3590E3]/[0.06] p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(53,144,227,0.15)_0%,transparent_70%)] pointer-events-none" />
          <p className="text-[0.65rem] font-unbounded font-semibold text-[#3590E3] tracking-[0.2em] uppercase mb-4 relative">
            Prêt à démarrer ?
          </p>
          <h2 className="font-unbounded font-black text-3xl md:text-4xl tracking-tight leading-tight mb-4 relative">
            Lancez PulsAI en <span className="text-[#BAF09D]">5 minutes</span>
          </h2>
          <p className="text-white/40 text-sm mb-8 relative">
            Aucune carte bancaire requise · 14 jours d'essai · Annulation libre
          </p>
          <Link
            to="/register"
            className="relative inline-block px-10 py-4 rounded-xl bg-[#3590E3] text-white font-medium text-base hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-200"
          >
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-8 py-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-unbounded font-black text-lg bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent">
          PulsAI
        </span>
        <p className="text-xs text-white/30">
          © 2026 PulsAI · Tous droits réservés
        </p>
        <div className="flex gap-6 text-xs text-white/30">
          {["Confidentialité", "Conditions", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-white/60 transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
