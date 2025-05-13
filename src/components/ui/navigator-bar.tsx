import React, { useState } from 'react';

// Interface para os itens de navegação
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

// Props do componente
interface BottomNavigationBarProps {
  variant?: 'user' | 'acs';
  initialActiveId?: string;
  onItemClick?: (itemId: string) => void;
  customItems?: NavItem[]; // Para permitir itens totalmente personalizados
}

const BottomNavigationBar: React.FC<BottomNavigationBarProps> = ({
  variant = 'user',
  initialActiveId,
  onItemClick,
  customItems,
}) => {
  // Itens de navegação predefinidos por variante
  const navItemVariants = {
    user: [
      {
        id: 'home',
        label: 'Casa',
        icon: <span role="img" aria-label="home" className="mgc_home_4_line"></span>,
      },
      {
        id: 'meds',
        label: 'Remédios',
        icon: <span role="img" aria-label="calendar" className="mgc_calendar_line"></span>,
      },
      {
        id: 'diary',
        label: 'Diário',
        icon: <span role="img" aria-label="book" className='mgc_book_6_line'></span>,
      },
      {
        id: 'emergency',
        label: 'Emergências',
        icon: <span role="img" aria-label="warning" className='mgc_alert_line'></span>,
      },
      {
        id: 'profile',
        label: 'Eu',
        icon: <span role="img" aria-label="user" className='mgc_user_3_line'></span>,
      },
    ],
    acs: [
      {
        id: 'home',
        label: 'Casa',
        icon: <span role="img" aria-label="home" className="mgc_home_4_line"></span>,
      },
      {
        id: 'consults',
        label: 'Próximas consultas',
        icon: <span role="img" aria-label="consults" className="mgc_alarm_2_line"></span>,
      },
      {
        id: 'patients',
        label: 'Pacientes',
        icon: <span role="img" aria-label="patients" className='mgc_group_3_line'></span>,
      },
      {
        id: 'emergency',
        label: 'Checar emergências',
        icon: <span role="img" aria-label="warning" className='mgc_report_line'></span>,
      },
      {
        id: 'profile',
        label: 'Eu',
        icon: <span role="img" aria-label="user" className='mgc_user_3_line'></span>,
      },
    ],
  };

  // Escolhe os itens de navegação com base na variante ou usa itens personalizados
  const navItems = customItems || navItemVariants[variant];
  
  // Define o ID ativo inicial com base nos itens disponíveis
  const defaultActiveId = initialActiveId || navItems[0]?.id || '';
  
  // Estado para controlar qual item está ativo
  const [activeItemId, setActiveItemId] = useState<string>(defaultActiveId);

  // Função para lidar com o clique nos itens
  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId);
    // Chamar callback externo se fornecido
    if (onItemClick) {
      onItemClick(itemId);
    }
  };

  return (
    <div className="flex justify-around items-center py-2.5 bg-background w-full fixed bottom-0 left-0 shadow-[0_-1px_5px_rgba(0,0,0,0.1)] border-t border-input z-50">
      {navItems.map((item) => {
        const isActive = activeItemId === item.id;
        
        return (
          <div
            key={item.id}
            className={`
              flex flex-col items-center font-medium text-xs font-inter cursor-pointer
              ${navItems.length ? `w-[${100 / navItems.length}%]` : 'w-1/5'}
            `}
            onClick={() => handleItemClick(item.id)}
          >
            <div
              className={`
                flex justify-center items-center w-10 h-10 mb-1 text-2xl rounded-[10px]
                transition-all duration-200 ease-in-out
                ${isActive ? 'bg-selection text-offwhite' : 'bg-background text-gray2'}
              `}
            >
              {item.icon}
            </div>
            <div 
              className={`
                flex justify-center items-center h-7 text-center text-[10px] leading-3
                font-inter font-medium transition-colors duration-200
                ${isActive ? 'text-primary' : 'text-gray2'}
              `}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNavigationBar;