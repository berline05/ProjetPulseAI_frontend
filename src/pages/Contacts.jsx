import React from 'react';
import CampaignEditor from '../components/marketing/CampaignEditor';

export default function Contacts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <section className="p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-2">Contacts</h3>
        <div className="text-sm text-gray-600">Liste de contacts (à connecter au backend)</div>
      </section>
      <section className="p-4 border rounded-lg bg-white">
        <CampaignEditor />
      </section>
    </div>
  );
}