import React from 'react';


interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Casa',
    icon: <span role="img" aria-label="home" className="mgc_home_4_line"></span>, // Replace with your icon component
    active: true,
  },
  {
    label: 'Remédios e consultas',
    icon: <span role="img" aria-label="calendar" className="mgc_calendar_line"></span>, // Replace with your icon component
  },
  {
    label: 'Diário',
    icon: <span role="img" aria-label="book" className='mgc_book_6_line'></span>, // Replace with your icon component
  },
  {
    label: 'Emergências',
    icon: <span role="img" aria-label="warning" className='mgc_emergency_flashers_line'></span>, // Replace with your icon component
  },
  {
    label: 'Eu',
    icon: <span role="img" aria-label="user" className='mgc_user_2_line'></span>, // Replace with your icon component
  },
];

const BottomNavigationBar: React.FC = () => {
  return (
    <div style={styles.container}>
      {navItems.map((item, index) => (
        <div
          key={index}
          style={{
            ...styles.item,
            ...(item.active ? styles.activeItem : {}),
          }}
        >
            <div style={{
            ...styles.icon,
            backgroundColor: item.active ? '#FA6E5A' : '#FFFFFF',
            borderRadius: '10px',
            }}>{item.icon}</div>
          <div style={styles.label}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '8px 0',
    boxShadow: '0 -1px 5px rgba(0, 0, 0, 0.1)',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    color: '#A0A3B1',
    fontWeight: 500,
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
    cursor: 'pointer',
  },
  activeItem: {
    color: '#A0A3B1',
    fontWeight: 500,
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif',
  },
  icon: {
    fontSize: '24px',
    marginBottom: '4px',
  },
  label: {
    fontSize: '10px',
  },
};

export default BottomNavigationBar;