// src/pages/VerifyEmailPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmail } from "../services/auth";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading | success | error | no-token
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("no-token");
      return;
    }
    verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message);
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message);
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-[#E8EDF5] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(53,144,227,0.15)_0%,transparent_60%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-block font-unbounded font-black text-xl bg-gradient-to-r from-[#3590E3] to-[#BAF09D] bg-clip-text text-transparent mb-10">
          PulsAI
        </Link>

        <div className="bg-white/[0.04] border border-white/[0.09] rounded-2xl p-10 shadow-2xl">

          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#3590E3]/10 border border-[#3590E3]/20 flex items-center justify-center mx-auto mb-6">
                <span className="w-6 h-6 border-2 border-[#3590E3]/30 border-t-[#3590E3] rounded-full animate-spin" />
              </div>
              <h1 className="font-unbounded font-black text-xl text-white mb-2">Vérification en cours…</h1>
              <p className="text-sm text-white/40">Patientez quelques secondes.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#BAF09D]/10 border border-[#BAF09D]/20 flex items-center justify-center mx-auto mb-6 text-3xl">
                ✅
              </div>
              <h1 className="font-unbounded font-black text-xl text-white mb-3">Email vérifié !</h1>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">{message || "Votre compte est maintenant actif."}</p>
              <Link
                to="/login"
                className="inline-block w-full py-3 rounded-xl bg-[#3590E3] text-white text-sm font-medium hover:bg-[#2a7fd4] transition-all"
              >
                Se connecter →
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">
                ❌
              </div>
              <h1 className="font-unbounded font-black text-xl text-white mb-3">Lien invalide</h1>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">
                {message || "Ce lien de vérification est invalide ou a expiré."}
              </p>
              <Link
                to="/register"
                className="inline-block w-full py-3 rounded-xl border border-[#3590E3]/40 text-[#3590E3] text-sm font-medium hover:bg-[#3590E3]/10 transition-all"
              >
                Créer un nouveau compte
              </Link>
            </>
          )}

          {/* No token */}
          {status === "no-token" && (
            <>
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-6 text-3xl">
                📧
              </div>
              <h1 className="font-unbounded font-black text-xl text-white mb-3">Vérifiez votre email</h1>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Un email de vérification vous a été envoyé. Cliquez sur le lien dans l'email pour activer votre compte.
              </p>
              <p className="text-xs text-white/25">Vérifiez aussi vos spams.</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}