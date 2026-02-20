import React from 'react';

export default function MessageBubble({ message }) {
  const isUser = message.from === 'user';
  const text = message.text ?? '';
  const time = message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : '';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[78%] px-3 py-2 rounded-lg ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
      }`}>
        <div className="text-sm">{text}</div>
        {time && <div className="text-xs text-gray-500 mt-1 ml-1 text-right">{time}</div>}
      </div>
    </div>
  );
}