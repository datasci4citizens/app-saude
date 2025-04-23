import React from 'react';

interface HomeBannerProps {
  title?: string;
  subtitle?: string;
  onClick?: () => void;
  onIconClick?: () => void; // Nova prop para navegação ao clicar no ícone
}

const HomeBanner: React.FC<HomeBannerProps> = ({
  title = "Registro diário",
  subtitle = "Registre agora",
  onClick,
  onIconClick
}) => {
  return (
    <div 
      style={styles.container}
      onClick={onClick}
    >
      {/* Shapes decorativos */}
      <div style={styles.shapeTop}></div>
      <div style={styles.shapeMiddle}></div>
      <div style={styles.shapeBottom}></div>
      
      {/* Conteúdo */}
      <div style={styles.content}>
        <div>
          <h2 style={styles.title}>{title}</h2>
          <p style={styles.subtitle}>{subtitle}</p>
        </div>
        
        {/* Ícone de editar com evento de clique próprio */}
        <div 
          style={styles.iconContainer}
          onClick={(e) => {
            e.stopPropagation(); // Impede que o clique ative também o onClick do banner
            if (onIconClick) onIconClick();
          }}
        >
          <span className="mgc_pencil_line" style={styles.icon}></span>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    backgroundColor: '#1768F2',
    padding: '24px',
    color: 'white',
    overflow: 'hidden',
    height: '160px',
    width: '100%',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  content: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    height: '100%',
    zIndex: 10
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0,
    marginBottom: '4px',
    fontFamily: '"Work Sans", sans-serif'
  },
  subtitle: {
    fontSize: '11px',
    margin: 0,
    opacity: 0.9,
    letterSpacing: '0.5px',
    fontFamily: '"Inter", sans-serif',
    fontWeight: 'medium'
  },
  iconContainer: {
    backgroundColor: 'white',
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    fontSize: '24px',
    color: '#5A96FA'
  },
  shapeTop: {
    position: 'absolute',
    top: '-50px',
    right: '20px',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1
  },
  shapeMiddle: {
    position: 'absolute',
    top: '40px',
    right: '-20px',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1
  },
  shapeBottom: {
    position: 'absolute',
    bottom: '-40px',
    left: '30%',
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1
  }
};

export default HomeBanner;