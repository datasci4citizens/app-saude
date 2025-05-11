import React from 'react';

interface HabitCardProps {
  title: string;
  className?: string;
}

/**
 * HabitCard - Componente para exibir um hábito como card
 * 
 * @param title - Texto do hábito (obrigatório)
 * @param className - Classes adicionais para customização
 */
const HabitCard: React.FC<HabitCardProps> = ({ 
  title, 
  className = "" 
}) => {
  return (
    <div 
      className={`
        bg-orange
        text-off_white
        font-inter
        font-bold
        text-lg
        py-3 
        px-4 
        rounded-xl
        flex
        shadow-sm
        mb-1
        ${className}
      `}
    >
      {title}
    </div>
  );
};

export default HabitCard;

