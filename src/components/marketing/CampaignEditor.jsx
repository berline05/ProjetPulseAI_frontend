import React, { useState } from 'react';

export default function CampaignEditor() {
  const [name, setName] = useState('');
  const [template, setTemplate] = useState('default');

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Éditeur de campagne</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="border rounded p-2" placeholder="Nom de la campagne" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="border rounded p-2" value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="default">Template par défaut</option>
          <option value="promo">Promo</option>
          <option value="onboarding">Onboarding</option>
        </select>
      </div>
      <div className="mt-4">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Sauvegarder</button>
      </div>
    </div>
  );
}