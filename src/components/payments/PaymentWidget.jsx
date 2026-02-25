import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9900,
    color: 'border-gray-200',
    badge: '',
    features: ['1 canal', '500 messages/mois', 'Chat Web', 'Support email'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 29900,
    color: 'border-blue-500',
    badge: 'Populaire',
    features: ['5 canaux', '5 000 messages/mois', 'WhatsApp inclus', 'Support prioritaire'],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99900,
    color: 'border-purple-500',
    badge: 'Complet',
    features: ['Canaux illimités', 'Messages illimités', 'IA personnalisée', 'Support dédié 24/7'],
  },
];

export default function PaymentWidget({ userId, onPaymentSuccess }) {
  const [loading, setLoading] = useState(null);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState('');

  const handleSelectPlan = async (plan) => {
    setLoading(plan.id);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/payment/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId || 'guest',
          amount: plan.price,
          reason: `PulsAI ${plan.name} — ${plan.price} FCFA/mois`,
          name: '',
          email: '',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedPlan(plan);
        setPaymentUrl(data.payment_url);
      } else {
        setError('Erreur lors de la création du lien de paiement.');
      }
    } catch (e) {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-2">Choisissez votre plan</h2>
      <p className="text-center text-gray-500 mb-6 text-sm">Paiement sécurisé via KKiaPay — Mobile Money, Carte, Virement</p>

      {/* Plans */}
      {!paymentUrl && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative border-2 ${plan.color} rounded-xl p-5 flex flex-col hover:shadow-lg transition-shadow`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {plan.badge}
                </span>
              )}
              <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
              <div className="text-2xl font-extrabold text-blue-700 mb-1">
                {plan.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">FCFA/mois</span>
              </div>
              <ul className="text-sm text-gray-600 mb-4 flex-1 space-y-1 mt-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-1">
                    <span className="text-green-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={loading === plan.id}
                className="mt-auto w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 transition"
              >
                {loading === plan.id ? 'Chargement...' : 'Choisir ce plan'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Lien de paiement généré */}
      {paymentUrl && selectedPlan && (
        <div className="text-center bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="text-4xl mb-2">💳</div>
          <h3 className="text-lg font-bold mb-1">Plan {selectedPlan.name} sélectionné</h3>
          <p className="text-gray-600 text-sm mb-4">
            {selectedPlan.price.toLocaleString()} FCFA/mois — Cliquez pour payer via KKiaPay
          </p>
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition"
          >
            Payer maintenant →
          </a>
          <button
            onClick={() => { setPaymentUrl(null); setSelectedPlan(null); }}
            className="block mx-auto mt-3 text-sm text-gray-400 hover:text-gray-600"
          >
            Changer de plan
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

      {/* Logos moyens de paiement */}
      <div className="flex justify-center gap-4 mt-6 text-xs text-gray-400 flex-wrap">
        <span className="flex items-center gap-1">📱 MTN Mobile Money</span>
        <span className="flex items-center gap-1">📱 Moov Money</span>
        <span className="flex items-center gap-1">💳 Carte bancaire</span>
        <span className="flex items-center gap-1">🏦 Virement</span>
      </div>
    </div>
  );
}