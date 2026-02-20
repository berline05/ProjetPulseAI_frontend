import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import GlassCard from './GlassCard';

/**
 * StatCard Component
 * Affiche une statistique avec icône, valeur, et tendance
 * 
 * @param {Object} props
 * @param {React.Component} props.icon - Icône Lucide React
 * @param {string} props.title - Titre de la statistique
 * @param {string|number} props.value - Valeur principale
 * @param {string} props.change - Pourcentage de changement
 * @param {string} props.trend - 'up' ou 'down'
 * @param {number} props.delay - Délai d'animation
 */
const StatCard = ({ 
  icon: Icon, 
  title, 
  value, 
  change, 
  trend,
  delay = 0
}) => {
  const isPositive = trend === 'up';
  
  return (
    <GlassCard delay={delay}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* En-tête avec icône */}
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-[#3590E3]" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              {title}
            </p>
          </div>
          
          {/* Valeur et tendance */}
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-[#1F2937]">
              {value}
            </h3>
            <div 
              className={`
                flex items-center gap-1 mb-1 
                ${isPositive ? 'text-green-600' : 'text-red-600'}
              `}
            >
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span className="text-sm font-semibold">
                {change}
              </span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default StatCard;