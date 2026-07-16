// src/pages/VerifyEmailPage.jsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? "loading" : "no-token");
  const [message, setMessage] = useState("");
  const called = useRef(false);

  useEffect(() => {
    if (!token || called.current) return;
    called.current = true;

    verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data?.message || "Votre compte est maintenant actif. Vous pouvez vous connecter.");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || "Ce lien de vérification est invalide ou a expiré. Veuillez vous réinscrire.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'Ubuntu', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Ubuntu:wght@300;400;500&display=swap'); .font-unbounded { font-family: 'Unbounded', sans-serif !important; }`}</style>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(53,144,227,0.15)_0%,transparent_60%)]" />
      </div>
      <div className="relative z-10 w-full max-w-md text-center">
        <Link to="/" className="inline-block font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent mb-10">PulsAI</Link>
        <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-10 shadow-2xl">
          {status === "loading" && (<><div className="w-16 h-16 rounded-full bg-[#3590E3]/10 border border-[#3590E3]/20 flex items-center justify-center mx-auto mb-6"><span className="w-6 h-6 border-2 border-[#3590E3]/30 border-t-[#3590E3] rounded-full animate-spin" /></div><h1 className="font-unbounded font-black text-xl text-white mb-2">Chargement…</h1></>)}
          {status === "success" && (<><div className="w-16 h-16 rounded-full bg-[#BAF09D]/10 border border-[#BAF09D]/20 flex items-center justify-center mx-auto mb-6 text-3xl">✅</div><h1 className="font-unbounded font-black text-xl text-white mb-3">Email vérifié !</h1><p className="text-sm text-white/50 mb-8 leading-relaxed">{message}</p><Link to="/login" className="inline-block w-full py-3 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] transition-all">Se connecter →</Link></>)}
          {status === "error" && (<><div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">❌</div><h1 className="font-unbounded font-black text-xl text-white mb-3">Lien invalide</h1><p className="text-sm text-white/50 mb-8 leading-relaxed">{message}</p><Link to="/register" className="inline-block w-full py-3 rounded-xl border border-[#3590E3]/40 text-[#3590E3] text-sm font-medium hover:bg-[#3590E3]/10 transition-all">Créer un nouveau compte</Link></>)}
          {status === "no-token" && (<><div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">📧</div><h1 className="font-unbounded font-black text-xl text-white mb-3">Vérifiez votre email</h1><p className="text-sm text-white/50 mb-6 leading-relaxed">Un email de vérification vous a été envoyé. Cliquez sur le lien dans l'email pour activer votre compte.</p><div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-6"><p className="text-xs text-white/40">💡 Vérifiez vos <strong className="text-white/60">spams</strong> si vous ne voyez pas l'email.</p></div><Link to="/login" className="inline-block w-full py-3 rounded-xl border border-white/[0.08] text-white/40 text-sm font-medium hover:text-white/70 transition-all">Déjà un compte ? Se connecter</Link></>)}
        </div>
      </div>
    </div>
  );
}