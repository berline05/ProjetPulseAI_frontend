import React from 'react';

export default function TicketList({ tickets = [], onSelect }) {
  return (
    <div className="space-y-2">
      {tickets.map((t) => (
        <div key={t.id} className="p-3 border rounded-lg flex justify-between items-start bg-white hover:shadow-sm">
          <div>
            <div className="font-semibold">{t.title}</div>
            <div className="text-sm text-gray-600">{t.status} • {t.priority}</div>
          </div>
          <button className="px-2 py-1 rounded bg-blue-600 text-white" onClick={() => onSelect?.(t.id)}>
            Voir
          </button>
        </div>
      ))}
    </div>
  );
}