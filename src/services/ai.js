const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchIAResponse({ userId, channel, text, history = [], stage = 'greeting' }) {
  const res = await fetch(`${API_BASE}/api/ai/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, channel, text, history, stage }),
  });
  if (!res.ok) throw new Error('Failed IA');
  const data = await res.json();
  return { text: data.text, timestamp: data.timestamp ?? Date.now() };
}

export async function fetchChannelMessages(userId, channel) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/messages/${userId}/${channel}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.messages || [];
  } catch {
    return [];
  }
}