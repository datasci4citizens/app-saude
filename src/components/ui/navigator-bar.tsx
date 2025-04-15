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
    <div style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeItemId === item.id;
        
        return (
          <div
            key={item.id}
            style={{
              ...styles.item,
              ...(isActive ? styles.activeItem : {}),
              width: `${100 / navItems.length}%`, // Largura dinâmica baseada no número de itens
            }}
            onClick={() => handleItemClick(item.id)}
          >
            <div
              style={{
                ...styles.icon,
                backgroundColor: isActive ? '#FA6E5A' : '#FFFFFF',
                borderRadius: '10px',
                color: isActive ? '#F9F9FF' : '#A0A3B1',
              }}
            >
              {item.icon}
            </div>
            <div 
              style={{
                ...styles.label,
                color: isActive ? '#FA6E5A' : '#A0A3B1',
              }}
            >
              {item.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Estilos (mantenha seus estilos existentes)
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: '10px 0',
    backgroundColor: '#fff',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
    zIndex: 100,
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontWeight: 500,
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  },
  icon: {
    fontSize: '24px',
    marginBottom: '4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40px',
    height: '40px',
    transition: 'all 0.2s ease-in-out',
  },
  label: {
    fontSize: '10px',
    height: '28px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'color 0.2s ease-in-out',
    lineHeight: '12px',
    fontFamily: 'Inter, sans-serif',
    fontWeight: 500,
  },
};

export default BottomNavigationBar;
