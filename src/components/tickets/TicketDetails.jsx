import React from 'react';

export default function TicketDetail({ ticket }) {
  if (!ticket) return <div>Choisissez un ticket</div>;
  return (
    <div className="p-3 border rounded-lg bg-white">
      <div className="flex justify-between items-center">
        <div className="font-semibold">{ticket.title}</div>
        <span className={`px-2 py-1 text-xs rounded ${ticket.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
          {ticket.status}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-700">{ticket.description}</div>
      <div className="mt-2 text-xs text-gray-500">Créé: {new Date(ticket.createdAt).toLocaleDateString()}</div>
    </div>
  );
}