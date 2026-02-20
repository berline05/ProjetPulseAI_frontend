import React, { useState } from 'react';
import { Eye, User } from 'lucide-react';

export default function OnboardingWizard({ onComplete }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const next = () => {
    if (step < 3) setStep(step + 1);
    else onComplete?.();
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-lg bg-white shadow">
      <h2 className="text-xl font-semibold mb-3">Portail client</h2>
      {step === 1 && (
        <div>
          <div className="mb-2 text-sm text-gray-700">Créez votre compte</div>
          <input className="w-full border rounded p-2 mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border rounded p-2" placeholder="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="mb-2 text-sm text-gray-700">Vérification</div>
          <div className="flex items-center gap-2">
            <Eye />
            <span>Vérification simplifiée</span>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="text-sm text-gray-700">Compte prêt. Cliquez continuer pour accéder au dashboard.</div>
      )}
      <div className="mt-4 flex justify-end">
        <button className="px-4 py-2 rounded bg-gray-200 mr-2" onClick={() => setStep(Math.max(1, step - 1))}>Retour</button>
        <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={next}>Continuer</button>
      </div>
    </div>
  );
}