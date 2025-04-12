import React from 'react';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const navItems: NavItem[] = [
  {
    label: 'Remedio',
    icon: <span role="img" aria-label="capsule" className="mgc_capsule_line"></span>, // Replace with your icon component
    active: true,
  },
];

const CapsuleIcon: React.FC = () => {
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
              backgroundColor:'transparent', // Change #FFFFFF to transparent or your button's white color
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
    marginBottom: '2px',
    padding: '2px', // Add some padding for better appearance,
  },
  label: {
    fontSize: '10px',
  },
};

export default CapsuleIcon;