import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard Component
 * Carte avec effet glassmorphism et animations d'entrée
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {string} props.className - Classes CSS additionnelles
 * @param {number} props.delay - Délai d'animation en secondes
 * @param {Object} props.onClick - Fonction de clic optionnelle
 */
const GlassCard = ({ 
  children, 
  className = '', 
  delay = 0,
  onClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -4,
        transition: { duration: 0.2 }
      }}
      className={`
        bg-white/80 backdrop-blur-sm 
        border border-gray-100 
        rounded-2xl p-6 
        shadow-lg hover:shadow-xl 
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;