import React from 'react';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="p-4 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-semibold" style={{ color: '#3590E3' }}>PulsAI CRM</div>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-gray-700 hover:text-primary">Dashboard</a>
            <a href="#" className="text-gray-700 hover:text-primary">Contacts</a>
            <a href="#" className="text-gray-700 hover:text-primary">Tickets</a>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">{children}</main>
    </div>
  );
}