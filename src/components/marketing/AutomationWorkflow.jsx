import React from 'react';

export default function AutomationWorkflow() {
  // MVP: affichage statique d’un workflow
  const steps = [
    { id: 1, name: 'New lead', action: 'Tag: lead' },
    { id: 2, name: 'Qualification', action: 'Score > 60' },
    { id: 3, name: 'Send nurture email', action: 'Email campaign' },
  ];

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-3">Workflow automatisé</h3>
      <ol className="list-decimal pl-5 space-y-2">
        {steps.map((s) => (
          <li key={s.id} className="text-sm text-gray-700">
            {s.name} - {s.action}
          </li>
        ))}
      </ol>
    </div>
  );
}