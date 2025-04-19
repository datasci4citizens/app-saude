import React from 'react';

interface HabitCardProps {
  number: number;
  title?: string;
  className?: string;
}

/**
 * HabitCard - Componente para exibir um hábito como card
 * 
 * @param number - Número do hábito
 * @param title - Texto opcional para substituir "Hábito"
 * @param className - Classes adicionais para customização
 */
const HabitCard: React.FC<HabitCardProps> = ({ 
  number, 
  title = "Hábito", 
  className = "" 
}) => {
  return (
    <div 
      className={`
        bg-orange
        text-white 
        font-medium 
        py-3 
        px-4 
        rounded-xl
        flex
        font-bold
        shadow-sm
        ${className}
      `}
      style={{
        fontSize: '18px',
        fontWeight: 'bold',
        fontFamily: 'Inter, sans-serif',
        color: '#F9F9FF',
        marginBottom: '4px'
      }}
    >
      {title} {number}
    </div>
  );
};

export default HabitCard;