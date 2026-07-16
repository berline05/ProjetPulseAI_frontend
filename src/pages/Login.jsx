// src/pages/LoginPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, forgotPassword } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

/* ─── Composants réutilisables ─── */
function Input({ label, id, error, type = "text", rightSlot, ...props }) {
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

/* ─── MODAL MOT DE PASSE OUBLIÉ ─── */
function ForgotModal({ onClose }) {
  const [email, setEmail]   = useState("");
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email invalide");
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(11,15,26,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}>
      <div className="w-full max-w-sm bg-[#111827] border border-white/[0.09] rounded-2xl p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}>

        {!sent ? (
          <>
            <h2 className="font-unbounded font-bold text-lg text-white mb-2">Mot de passe oublié</h2>
            <p className="text-xs text-white/40 mb-6 leading-relaxed">
              Entrez votre email. Si un compte existe, vous recevrez un lien de réinitialisation.
            </p>
            {error && <Alert message={error} type="error" />}
            <form onSubmit={handleSubmit}>
              <Input id="forgot-email" placeholder="vous@entreprise.com" type="email"
                value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
              <div className="flex gap-3 mt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-white/40 text-xs hover:text-white/70 transition-all">
                  Annuler
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-[#3590E3] text-white text-xs font-medium hover:bg-[#2a7fd4] disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                  {loading ? <><Spinner /> Envoi...</> : "Envoyer →"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center py-4">
              <div className="text-4xl mb-4">📧</div>
              <h2 className="font-unbounded font-bold text-lg text-white mb-2">Email envoyé !</h2>
              <p className="text-xs text-white/40 leading-relaxed mb-6">
                Si cet email est associé à un compte, vous recevrez un lien dans quelques minutes. Vérifiez vos spams.
              </p>
              <button onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#3590E3] text-white text-xs font-medium hover:bg-[#2a7fd4] transition-all">
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── PAGE CONNEXION ─── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]     = useState(false);
  const [errors, setErrors]         = useState({});
  const [alert, setAlert]           = useState(null);
  const [loading, setLoading]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Email invalide";
    if (!password) errs.password = "Mot de passe requis";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setAlert(null);
    try {
      const data = await login({ email, password });

      // Mettre à jour le contexte auth immédiatement (évite user=null dans le dashboard)
      setUser(data.company);

      navigate("/dashboard");

    } catch (err) {
      // Cas spécial : email non vérifié
      if (err.message.includes("vérifier votre email")) {
        setAlert({
          msg: "📧 " + err.message,
          type: "warning",
        });
      } else {
        setAlert({ msg: err.message, type: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] flex items-center justify-center relative overflow-hidden px-4"
        style={{ fontFamily: "'Ubuntu', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Ubuntu:wght@300;400;500&display=swap'); .font-unbounded { font-family: 'Unbounded', sans-serif !important; }`}</style>

        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(53,144,227,0.15)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_80%,rgba(186,240,157,0.08)_0%,transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">

          {/* ─── CÔTÉ MARQUE ─── */}
          <div className="hidden md:flex flex-col">
            <Link to="/" className="font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent mb-10">
              PulsAI
            </Link>
            <h2 className="font-unbounded font-black text-3xl leading-tight tracking-tight mb-4">
              Bon retour<br />parmi nous. 👋
            </h2>
            <p className="text-sm text-white/45 leading-relaxed mb-8">
              Accédez à votre tableau de bord, vos conversations IA et vos automatisations.
            </p>
            {/* Stats rapides */}
            <div className="space-y-3">
              {[
                { label: "Conversations IA actives", value: "24/7" },
                { label: "Tickets traités automatiquement", value: "80%" },
                { label: "Satisfaction client moyenne", value: "4.8/5" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-xs text-white/40">{label}</span>
                  <span className="text-xs font-unbounded font-bold text-[#BAF09D]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CARTE CONNEXION ─── */}
          <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6">
              <Link to="/" className="md:hidden font-unbounded font-black text-lg bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent block mb-4">
                PulsAI
              </Link>
              <h1 className="font-unbounded font-black text-2xl tracking-tight mb-1">Connexion</h1>
              <p className="text-xs text-white/40">
                Pas encore de compte ?{" "}
                <Link to="/register" className="text-[#3590E3] hover:underline">S'inscrire gratuitement →</Link>
              </p>
            </div>

            <Alert message={alert?.msg} type={alert?.type} />

            <form onSubmit={handleLogin} noValidate>
              <Input label="Email" id="email" type="email" placeholder="vous@entreprise.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                error={errors.email} autoComplete="email" />

              <Input label="Mot de passe" id="password" type={showPassword ? "text" : "password"}
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                error={errors.password} autoComplete="current-password"
                rightSlot={
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="text-white/30 hover:text-white/60 transition-colors text-base">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                }
              />

              <div className="flex items-center justify-between mb-6 mt-1">
                <label className="flex items-center gap-2 text-xs text-white/45 cursor-pointer select-none">
                  <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
                    className="accent-[#3590E3] cursor-pointer" />
                  Se souvenir de moi
                </label>
                <button type="button" onClick={() => setShowForgot(true)}
                  className="text-xs text-[#3590E3] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2">
                {loading ? <><Spinner /> Connexion...</> : "Se connecter"}
              </button>
            </form>

            {/* Lien inscription */}
            <p className="text-center text-xs text-white/25 mt-6">
              En vous connectant, vous acceptez nos{" "}
              <a href="#" className="text-white/40 hover:text-white/60 transition-colors">CGU</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}