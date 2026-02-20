import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* ─── Mock API calls ─── */
const api = {
  login: async ({ email, password }) => {
    await new Promise((r) => setTimeout(r, 1600));
    // TODO: remplacer par → fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
    if (email === "demo@pulsai.fr" && password === "Demo1234!") {
      return { success: true };
    }
    throw new Error("Email ou mot de passe incorrect.");
  }
};

/* ─── Input component ─── */
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
          className={`w-full px-4 py-3 rounded-xl text-sm font-ubuntu bg-white/[0.04] border transition-all outline-none text-white placeholder:text-white/25
            ${error ? "border-red-500/60 bg-red-500/5 focus:ring-2 focus:ring-red-500/15" : "border-white/10 focus:border-[#3590E3] focus:bg-[#3590E3]/5 focus:ring-2 focus:ring-[#3590E3]/15"}`}
          {...props}
        />
        {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
      {error && <p className="text-red-400 text-[0.7rem] mt-1">{error}</p>}
    </div>
  );
}

/* ─── Alert ─── */
function Alert({ message, type }) {
  if (!message) return null;
  const styles = {
    error: "bg-red-500/10 border-red-500/30 text-red-300",
    success: "bg-green-500/10 border-green-500/30 text-green-300",
    warning: "bg-yellow-500/10 border-yellow-500/30 text-yellow-300",
  };
  return (
    <div className={`p-3 rounded-xl border text-xs leading-relaxed mb-4 ${styles[type]}`}>
      {message}
    </div>
  );
}

/* ─── Spinner ─── */
function Spinner() {
  return (
    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );
}

/* ─── MAIN LOGIN PAGE ─── */
export default function LoginPage() {
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  // Forgot modal
  const [showForgot, setShowForgot] = useState(false);

  /* ── Validate & Submit Login ── */
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
      const res = await api.login({ email, password });
      if (res.success) {
  navigate("/dashboard");
}
    } catch (err) {
      setAlert({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

      <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] font-ubuntu flex items-center justify-center relative overflow-hidden px-4">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_20%,rgba(53,144,227,0.15)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_70%_80%,rgba(186,240,157,0.08)_0%,transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center py-12">

          {/* ─── BRAND SIDE ─── */}
          <div className="hidden md:flex flex-col">
            <Link to="/" className="font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent mb-10">
              PulsAI
            </Link>
            <h2 className="font-unbounded font-black text-3xl leading-tight tracking-tight mb-4">
              Bon retour<br />parmi nous. 👋
            </h2>
            <p className="text-sm text-white/45 leading-relaxed mb-10">
              Accédez à votre tableau de bord, conversations IA et automatisations en un clic.
            </p>
          </div>

          {/* ─── CARD ─── */}
          <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                {/* Header */}
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
                {/* Form */}
                <form onSubmit={handleLogin} noValidate>
                  <Input
                    label="Email"
                    id="email"
                    type="email"
                    placeholder="vous@entreprise.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                    error={errors.email}
                    autoComplete="email"
                  />

                  <Input
                    label="Mot de passe"
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                    error={errors.password}
                    autoComplete="current-password"
                    rightSlot={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="text-white/30 hover:text-white/60 transition-colors text-base"
                      >
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between mb-6 mt-1">
                    <label className="flex items-center gap-2 text-xs text-white/45 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="accent-[#3590E3] cursor-pointer"
                      />
                      Se souvenir de moi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgot(true)}
                      className="text-xs text-[#3590E3] hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {loading ? <><Spinner /> Connexion en cours...</> : "Se connecter"}
                  </button>
                </form>
          </div>
        </div>
      </div>
    </>
  );
}