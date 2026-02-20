/**
 * Utilitaires de formatage pour le dashboard PulsAI
 */

/**
 * Formate un nombre avec séparateurs de milliers
 * @param {number} num - Nombre à formater
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num) => {
  return num.toLocaleString('fr-FR');
};

/**
 * Formate un nombre en notation compacte (K, M, B)
 * @param {number} num - Nombre à formater
 * @returns {string} Nombre formaté
 */
export const formatCompactNumber = (num) => {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Formate un pourcentage
 * @param {number} value - Valeur (0-100)
 * @param {number} decimals - Nombre de décimales
 * @returns {string} Pourcentage formaté
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formate une date relative (il y a X minutes/heures/jours)
 * @param {Date|string} date - Date à formater
 * @returns {string} Date formatée
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Il y a ${diffInMinutes} min`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `Il y a ${diffInDays}j`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `Il y a ${diffInWeeks} semaine${diffInWeeks > 1 ? 's' : ''}`;
  }

  return past.toLocaleDateString('fr-FR');
};

/**
 * Formate une durée en heures et minutes
 * @param {number} minutes - Durée en minutes
 * @returns {string} Durée formatée
 */
export const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Calcule le pourcentage de changement entre deux valeurs
 * @param {number} current - Valeur actuelle
 * @param {number} previous - Valeur précédente
 * @returns {Object} { value: number, formatted: string, trend: 'up'|'down'|'neutral' }
 */
export const calculateChange = (current, previous) => {
  if (previous === 0) {
    return {
      value: 0,
      formatted: '0%',
      trend: 'neutral'
    };
  }

  const change = ((current - previous) / previous) * 100;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';

  return {
    value: change,
    formatted: `${change > 0 ? '+' : ''}${change.toFixed(1)}%`,
    trend
  };
};

/**
 * Formate une devise
 * @param {number} amount - Montant
 * @param {string} currency - Code devise (EUR, USD, etc.)
 * @returns {string} Montant formaté
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Tronque un texte avec ellipse
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 50) => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Génère une couleur basée sur un statut
 * @param {string} status - Statut (success, warning, error, info, etc.)
 * @returns {Object} Classes Tailwind pour le statut
 */
export const getStatusColor = (status) => {
  const colors = {
    success: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200'
    },
    warning: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-200'
    },
    error: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    info: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    default: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-200'
    }
  };

  return colors[status] || colors.default;
};

/**
 * Génère une couleur de priorité
 * @param {string} priority - Priorité (high, medium, low)
 * @returns {Object} Classes Tailwind pour la priorité
 */
export const getPriorityColor = (priority) => {
  const colors = {
    high: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-200'
    },
    medium: {
      bg: 'bg-orange-100',
      text: 'text-orange-700',
      border: 'border-orange-200'
    },
    low: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-200'
    }
  };

  return colors[priority] || colors.medium;
};

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {boolean} True si valide
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};