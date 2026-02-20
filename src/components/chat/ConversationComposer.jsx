import React, { useState } from 'react';
import { Send } from 'lucide-react';

export default function ConversationComposer({ onSend, disabled, channelLabel }) {
  const [input, setInput] = useState('');

  const submit = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="flex items-center gap-2 pt-2 border-t">
      <input
        className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Envoyer un message (${channelLabel || 'Chat'})`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        disabled={disabled}
      />
      <button
        onClick={submit}
        className="inline-flex items-center justify-center w-9 h-9 rounded bg-blue-600 text-white hover:bg-blue-700"
        aria-label="Envoyer"
        disabled={disabled}
      >
        <Send size={16} />
      </button>
    </div>
  );
}