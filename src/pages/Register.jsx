// src/pages/SignupPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/auth";

/* ─── Composants réutilisables ─── */
function Input({ label, id, error, type = "text", rightSlot, hint, ...props }) {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-white/60 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          className={`w-full px-4 py-3 rounded-xl text-sm bg-white/[0.04] border transition-all outline-none text-white placeholder:text-white/25
            ${error
              ? "border-red-500/60 bg-red-500/5 focus:ring-2 focus:ring-red-500/15"
              : "border-white/10 focus:border-[#3590E3] focus:bg-[#3590E3]/5 focus:ring-2 focus:ring-[#3590E3]/15"
            }`}
          {...props}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {hint && !error && <p className="text-white/25 text-[0.7rem] mt-1">{hint}</p>}
      {error && <p className="text-red-400 text-[0.7rem] mt-1">{error}</p>}
    </div>
  );
}

function Alert({ message, type }) {
  if (!message) return null;
  const styles = {
    error:   "bg-red-500/10 border-red-500/30 text-red-300",
    success: "bg-green-500/10 border-green-500/30 text-green-300",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  };
  return (
    <div className={`p-3 rounded-xl border text-xs leading-relaxed mb-4 ${styles[type]}`}>
      {message}
    </div>
  );
}

function Spinner() {
  return <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />;
}

/* ─── PAGE INSCRIPTION ─── */
export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    companyName: "", password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [terms, setTerms]                 = useState(false);
  const [errors, setErrors]               = useState({});
  const [alert, setAlert]                 = useState(null);
  const [loading, setLoading]             = useState(false);

  const set = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.firstName.trim())    errs.firstName    = "Requis";
    if (!form.lastName.trim())     errs.lastName     = "Requis";
    if (!form.companyName.trim())  errs.companyName  = "Requis";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Email invalide";
    if (form.password.length < 8)  errs.password     = "Minimum 8 caractères";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Les mots de passe ne correspondent pas";
    if (!terms) errs.terms = "Vous devez accepter les conditions";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await register({
        firstName:   form.firstName,
        lastName:    form.lastName,
        email:       form.email,
        companyName: form.companyName,
        password:    form.password,
      });

      // ✅ Succès → rediriger vers page de vérification email
      navigate("/verify-email");

    } catch (err) {
      setAlert({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] flex relative overflow-hidden" style={{ fontFamily: "'Ubuntu', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Ubuntu:wght@300;400;500&display=swap'); .font-unbounded { font-family: 'Unbounded', sans-serif !important; }`}</style>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_0%_20%,rgba(53,144,227,0.2)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(186,240,157,0.1)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
      </div>

      {/* ─── PANNEAU GAUCHE ─── */}
      <div className="hidden lg:flex flex-col w-[42%] shrink-0 border-r border-white/[0.06] p-10 relative z-10">
        <Link to="/" className="font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent mb-auto">
          PulsAI
        </Link>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="font-unbounded font-black text-3xl leading-tight tracking-tight mb-4">
            Transformez vos<br />conversations en{" "}
            <span className="text-[#3590E3]">ventes</span>{" "}
            <span className="text-[#BAF09D]">automatiquement.</span>
          </h2>
          <p className="text-sm text-white/45 leading-relaxed mb-8">
            Commencez gratuitement. 14 jours d'essai. Aucune carte bancaire. Annulation libre.
          </p>
          {/* Checklist */}
          <div className="space-y-3">
            {[
              "IA conversationnelle 24h/24",
              "Gestion tickets & réclamations",
              "Campagnes marketing ciblées",
              "Analytics & satisfaction client",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#BAF09D]/15 border border-[#BAF09D]/30 flex items-center justify-center shrink-0">
                  <span className="text-[#BAF09D] text-[0.6rem]">✓</span>
                </div>
                <span className="text-sm text-white/55">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PANNEAU DROIT / FORMULAIRE ─── */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto relative z-10 py-10 px-4">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="lg:hidden font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent block mb-6">
            PulsAI
          </Link>

          <div className="mb-6">
            <h1 className="font-unbounded font-black text-2xl tracking-tight mb-1">Créer un compte</h1>
            <p className="text-xs text-white/40">
              Déjà inscrit ?{" "}
              <Link to="/login" className="text-[#3590E3] hover:underline">Se connecter →</Link>
            </p>
          </div>

          <Alert message={alert?.msg} type={alert?.type} />

          <form onSubmit={handleSubmit} noValidate>
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-3">
              <Input label="Prénom" id="firstName" placeholder="Kofi"
                value={form.firstName} onChange={set("firstName")} error={errors.firstName} autoComplete="given-name" />
              <Input label="Nom" id="lastName" placeholder="Mensah"
                value={form.lastName} onChange={set("lastName")} error={errors.lastName} autoComplete="family-name" />
            </div>

            <Input label="Nom de l'entreprise" id="companyName" placeholder="TechAfrique SARL"
              value={form.companyName} onChange={set("companyName")} error={errors.companyName} autoComplete="organization" />

            <Input label="Email professionnel" id="email" type="email" placeholder="kofi@entreprise.com"
              value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />

            <Input label="Mot de passe" id="password" type={showPassword ? "text" : "password"}
              placeholder="Min. 8 caractères" value={form.password} onChange={set("password")}
              error={errors.password} autoComplete="new-password"
              rightSlot={
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors text-base">
                  {showPassword ? "🙈" : "👁️"}
                </button>
              }
            />

            <Input label="Confirmer le mot de passe" id="confirmPassword" type={showConfirm ? "text" : "password"}
              placeholder="Répétez votre mot de passe" value={form.confirmPassword} onChange={set("confirmPassword")}
              error={errors.confirmPassword} autoComplete="new-password"
              rightSlot={
                <button type="button" onClick={() => setShowConfirm((v) => !v)} className="text-white/30 hover:text-white/60 transition-colors text-base">
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              }
            />

            {/* CGU */}
            <div className="mb-5">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input type="checkbox" checked={terms}
                  onChange={(e) => { setTerms(e.target.checked); setErrors((p) => ({ ...p, terms: "" })); }}
                  className="accent-[#3590E3] mt-0.5 cursor-pointer" />
                <span className="text-xs text-white/45 leading-relaxed">
                  J'accepte les{" "}
                  <a href="#" className="text-[#3590E3] hover:underline">Conditions d'utilisation</a>{" "}
                  et la{" "}
                  <a href="#" className="text-[#3590E3] hover:underline">Politique de confidentialité</a>.
                </span>
              </label>
              {errors.terms && <p className="text-red-400 text-[0.7rem] mt-1 ml-5">{errors.terms}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2">
              {loading ? <><Spinner /> Création du compte...</> : "Créer mon compte gratuit →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}