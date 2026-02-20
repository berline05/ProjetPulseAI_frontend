import React, { useState } from 'react';

export default function PaymentCheckout({ amount = 99, onSuccess }) {
  const [loading, setLoading] = useState(false);

  const pay = async () => {
    setLoading(true);
    try {
      // Appel backend pour créer une session Stripe et rediriger
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      if (!res.ok) throw new Error('Payment error');
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl; // redirection Stripe Checkout
    } catch (e) {
      console.error(e);
      alert('Échec du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Paiement</div>
        <div className="text-sm text-gray-600">{amount} €</div>
      </div>
      <button className="px-4 py-2 rounded bg-green-600 text-white" onClick={pay} disabled={loading}>
        {loading ? 'Chargement...' : 'Payer avec Stripe'}
      </button>
    </div>
  );
}
