import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer les statistiques du dashboard
 * Simule une récupération de données avec mise à jour en temps réel
 */
const useStats = () => {
  const [stats, setStats] = useState([
    { 
      id: 'conversations',
      icon: 'MessageSquare', 
      title: 'Conversations', 
      value: '2,847', 
      change: '+12.5%', 
      trend: 'up',
      rawValue: 2847
    },
    { 
      id: 'tickets',
      icon: 'Ticket', 
      title: 'Tickets Ouverts', 
      value: '163', 
      change: '-8.2%', 
      trend: 'down',
      rawValue: 163
    },
    { 
      id: 'emails',
      icon: 'Mail', 
      title: 'Emails Envoyés', 
      value: '48.2K', 
      change: '+23.1%', 
      trend: 'up',
      rawValue: 48200
    },
    { 
      id: 'conversion',
      icon: 'TrendingUp', 
      title: 'Taux de Conversion', 
      value: '68%', 
      change: '+5.4%', 
      trend: 'up',
      rawValue: 68
    }
  ]);

  const [loading, setLoading] = useState(false);

  // Simuler une mise à jour périodique des stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => {
          // Petite variation aléatoire pour simuler des données en temps réel
          const variation = Math.random() * 0.02 - 0.01; // -1% à +1%
          const newRawValue = Math.round(stat.rawValue * (1 + variation));
          
          return {
            ...stat,
            rawValue: newRawValue,
            value: formatStatValue(newRawValue, stat.id)
          };
        })
      );
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  // Fonction de formatage selon le type de stat
  const formatStatValue = (value, type) => {
    switch(type) {
      case 'emails':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'conversion':
        return `${value}%`;
      default:
        return value.toLocaleString('fr-FR');
    }
  };

  // Fonction pour rafraîchir manuellement les stats
  const refreshStats = async () => {
    setLoading(true);
    
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mettre à jour avec de nouvelles valeurs
    setStats(prevStats => 
      prevStats.map(stat => ({
        ...stat,
        rawValue: stat.rawValue + Math.floor(Math.random() * 100)
      }))
    );
    
    setLoading(false);
  };

  return {
    stats,
    loading,
    refreshStats
  };
};

export default useStats;