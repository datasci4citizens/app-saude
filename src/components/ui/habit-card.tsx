import React from 'react';

interface HabitCardProps {
  title: string;  // Made required since we're not showing numbers
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
        bg-[#FA6E5A]
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
      {title}
    </div>
  );
};

export default HabitCard;