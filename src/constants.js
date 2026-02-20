/**
 * Constantes de l'application PulsAI Dashboard
 */

// Couleurs de la charte graphique
export const COLORS = {
  primary: '#3590E3',
  secondary: '#BAF09D',
  neutral: {
    light: '#F9FAFB',
    dark: '#1F2937'
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6'
  }
};

// Polices
export const FONTS = {
  heading: 'Unbounded, sans-serif',
  body: 'Ubuntu, sans-serif'
};

// Durées d'animation (en millisecondes)
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  verySlow: 1000
};

// Statuts de tickets
export const TICKET_STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
};

export const TICKET_STATUS_LABELS = {
  [TICKET_STATUS.OPEN]: 'Ouvert',
  [TICKET_STATUS.PENDING]: 'En attente',
  [TICKET_STATUS.RESOLVED]: 'Résolu',
  [TICKET_STATUS.CLOSED]: 'Fermé'
};

// Priorités de tickets
export const TICKET_PRIORITY = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

export const TICKET_PRIORITY_LABELS = {
  [TICKET_PRIORITY.HIGH]: 'Haute',
  [TICKET_PRIORITY.MEDIUM]: 'Moyenne',
  [TICKET_PRIORITY.LOW]: 'Basse'
};

// Statuts de campagnes
export const CAMPAIGN_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed'
};

export const CAMPAIGN_STATUS_LABELS = {
  [CAMPAIGN_STATUS.DRAFT]: 'Brouillon',
  [CAMPAIGN_STATUS.SCHEDULED]: 'Programmée',
  [CAMPAIGN_STATUS.ACTIVE]: 'Active',
  [CAMPAIGN_STATUS.PAUSED]: 'En pause',
  [CAMPAIGN_STATUS.COMPLETED]: 'Terminée'
};

// Types de campagnes
export const CAMPAIGN_TYPES = {
  EMAIL: 'email',
  SMS: 'sms',
  PUSH: 'push',
  SOCIAL: 'social'
};

export const CAMPAIGN_TYPE_LABELS = {
  [CAMPAIGN_TYPES.EMAIL]: 'Email Marketing',
  [CAMPAIGN_TYPES.SMS]: 'SMS Marketing',
  [CAMPAIGN_TYPES.PUSH]: 'Push Notification',
  [CAMPAIGN_TYPES.SOCIAL]: 'Réseaux Sociaux'
};

// Types d'activités
export const ACTIVITY_TYPES = {
  MESSAGE: 'message',
  TICKET: 'ticket',
  EMAIL: 'email',
  USER: 'user',
  CAMPAIGN: 'campaign',
  SYSTEM: 'system'
};

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  AGENT: 'agent',
  USER: 'user'
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: 'Administrateur',
  [USER_ROLES.MANAGER]: 'Manager',
  [USER_ROLES.AGENT]: 'Agent',
  [USER_ROLES.USER]: 'Utilisateur'
};

// Limites de pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Intervalles de rafraîchissement (en millisecondes)
export const REFRESH_INTERVALS = {
  STATS: 30000,        // 30 secondes
  TICKETS: 60000,      // 1 minute
  ACTIVITIES: 15000,   // 15 secondes
  CAMPAIGNS: 120000    // 2 minutes
};

// Messages de l'application
export const MESSAGES = {
  SUCCESS: {
    TICKET_CREATED: 'Ticket créé avec succès',
    TICKET_UPDATED: 'Ticket mis à jour',
    TICKET_DELETED: 'Ticket supprimé',
    CAMPAIGN_CREATED: 'Campagne créée avec succès',
    CAMPAIGN_SENT: 'Campagne envoyée',
    SETTINGS_SAVED: 'Paramètres sauvegardés'
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue',
    NETWORK: 'Erreur de connexion',
    VALIDATION: 'Veuillez vérifier les informations saisies',
    PERMISSION: 'Vous n\'avez pas les permissions nécessaires'
  },
  CONFIRM: {
    DELETE_TICKET: 'Êtes-vous sûr de vouloir supprimer ce ticket ?',
    DELETE_CAMPAIGN: 'Êtes-vous sûr de vouloir supprimer cette campagne ?',
    SEND_CAMPAIGN: 'Êtes-vous sûr de vouloir envoyer cette campagne ?'
  }
};

// Routes de navigation
export const ROUTES = {
  DASHBOARD: '/',
  CONVERSATIONS: '/conversations',
  TICKETS: '/tickets',
  CAMPAIGNS: '/campaigns',
  ANALYTICS: '/analytics',
  CONTACTS: '/contacts',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  PROFILE: '/profile'
};

// Clés de stockage local
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'pulsai_user_preferences',
  THEME: 'pulsai_theme',
  SIDEBAR_STATE: 'pulsai_sidebar_state',
  FILTERS: 'pulsai_filters'
};

// Breakpoints responsive
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  laptop: 1024,
  desktop: 1280,
  wide: 1536
};

// Configuration des graphiques
export const CHART_CONFIG = {
  colors: [COLORS.primary, COLORS.secondary, '#8B5CF6', '#EC4899'],
  defaultHeight: 300,
  gridColor: '#E5E7EB',
  textColor: '#6B7280'
};

// Limites de validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_MESSAGE_LENGTH: 5000,
  MAX_SUBJECT_LENGTH: 200,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
};

export default {
  COLORS,
  FONTS,
  ANIMATION_DURATION,
  TICKET_STATUS,
  TICKET_STATUS_LABELS,
  TICKET_PRIORITY,
  TICKET_PRIORITY_LABELS,
  CAMPAIGN_STATUS,
  CAMPAIGN_STATUS_LABELS,
  CAMPAIGN_TYPES,
  CAMPAIGN_TYPE_LABELS,
  ACTIVITY_TYPES,
  USER_ROLES,
  USER_ROLE_LABELS,
  PAGINATION,
  REFRESH_INTERVALS,
  MESSAGES,
  ROUTES,
  STORAGE_KEYS,
  BREAKPOINTS,
  CHART_CONFIG,
  VALIDATION
};