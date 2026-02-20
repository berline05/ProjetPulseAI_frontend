export function getChannelLabel(channel) {
  switch (channel) {
    case 'whatsapp': return 'WhatsApp';
    case 'instagram': return 'Instagram';
    case 'web': return 'Web Chat';
    default: return 'Chat';
  }
}