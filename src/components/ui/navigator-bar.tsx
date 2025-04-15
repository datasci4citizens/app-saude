import React, { useState } from 'react';

interface NavItem {
  id: string; // Adicionando id para identificar cada item
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const BottomNavigationBar: React.FC = () => {
  // Estado para controlar qual item está ativo
  const [activeItemId, setActiveItemId] = useState<string>('home');

  // Dados dos itens de navegação
  const navItems: NavItem[] = [
    {
      id: 'home',
      label: 'Casa',
      icon: <span role="img" aria-label="home" className="mgc_home_4_line"></span>,
    },
    {
      id: 'meds',
      label: 'Remédios e consultas',
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
      icon: <span role="img" aria-label="warning" className='mgc_emergency_flashers_line'></span>,
    },
    {
      id: 'profile',
      label: 'Eu',
      icon: <span role="img" aria-label="user" className='mgc_user_2_line'></span>,
    },
  ];

  // Função para lidar com o clique nos itens
  const handleItemClick = (itemId: string) => {
    setActiveItemId(itemId);
    // Aqui você pode adicionar navegação se necessário
    // navigate(`/${itemId}`);
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
              width: '20%',
            }}
            onClick={() => handleItemClick(item.id)}
          >
            <div
              style={{
                ...styles.icon,
                backgroundColor: isActive ? '#FA6E5A' : '#FFFFFF',
                borderRadius: '10px',
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