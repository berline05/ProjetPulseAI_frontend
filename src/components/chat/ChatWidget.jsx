import React, { useEffect, useRef, useState } from 'react';
import { Send } from 'lucide-react';
import { fetchIAResponse, fetchChannelMessages } from '../../services/ai';
import MessageBubble from './MessageBubble';
import ConversationComposer from './ConversationComposer';
import { getChannelLabel } from '../../services/channels';

export default function ChatWidget({ channel, userId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  // Charger les messages initiaux
  useEffect(() => {
    (async () => {
      const historique = await fetchChannelMessages(userId, channel);
      if (historique?.length) setMessages(historique);
    })();
  }, [userId, channel]);

  // Scroll vers le bas à chaque ajout
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text) => {
    if (!text?.trim()) return;
    // Push user message
    const userMsg = { from: 'user', text, timestamp: Date.now() };
    setMessages((m) => [...m, userMsg]);
    // Appel IA
    setLoading(true);
    try {
      const aiResp = await fetchIAResponse({ userId, channel, text });
      if (aiResp) setMessages((m) => [...m, { from: 'ia', ...aiResp }]);
    } catch (e) {
      setMessages((m) => [...m, { from: 'ia', text: "Désolé, une erreur est survenue." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-4 bg-white shadow">
      <div className="flex-1 overflow-auto mb-2 p-2 border rounded-md bg-neutral-50">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={endRef} />
      </div>
      <ConversationComposer onSend={handleSend} disabled={loading} channelLabel={getChannelLabel(channel)} />
    </div>
  );
}