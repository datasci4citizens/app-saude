import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type InfoCardVariant = 'emergency' | 'appointment';

interface InfoCardProps {
  variant: InfoCardVariant;
  name?: string;
  subtitle?: string;
  count?: number;
  date?: string;
  time?: string;
  onClick?: () => void;
}

// Estilos separados para cards de emergência e consulta
const styles = {
  card: {
    base: {
      width: '38%', 
      borderRadius: '12px'
    },
    emergency: {
      background: '#FFC97E'
    },
    appointment: {
      background: 'white'
    }
  },
  button: {
    emergency: {
      background: '#141B36',
      hoverBackground: '#141B36/90',
    },
    appointment: {
      background: '#FA6E5A',
      hoverBackground: '#FA6E5A/90',
    }
  },
  text: {
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      color: '#464646',
      marginBottom: '4px'
    },
    count: {
      fontSize: '2.25rem', // text-4xl
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    label: {
      fontSize: '0.75rem', // text-xs
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    info: {
      fontSize: '11px', // text-sm
      fontWeight: 500,
      fontFamily: 'Work Sans, sans-serif',
      color: '#464646',
    }
  }
};

const InfoCard: React.FC<InfoCardProps> = ({
  variant,
  name,
  subtitle,
  count,
  date,
  time,
  onClick
}) => {
  const isEmergency = variant === 'emergency';
  
  // Determina o estilo do card com base na variante
  const cardStyle = {
    ...styles.card.base,
    backgroundColor: isEmergency ? styles.card.emergency.background : styles.card.appointment.background
  };

  // Determina o estilo do botão com base na variante
  const buttonClassName = `rounded-full px-6 py-2 text-sm text-white
    ${isEmergency 
      ? `bg-[${styles.button.emergency.background}] hover:bg-[${styles.button.emergency.hoverBackground}]` 
      : `bg-orange hover:bg-orange/90`}`;

  return (
    <Card 
      className="overflow-hidden"
      style={cardStyle}
    >
      <CardContent className="p-0">
        {isEmergency ? (
          /* Card de Emergência */
          <div className="flex flex-col items-center p-4">
            {/* Ícone de alerta */}
            <div className="mb-3">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 11.25V21.25" stroke="#FA6E5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 28.75C20.6904 28.75 21.25 28.1904 21.25 27.5C21.25 26.8096 20.6904 26.25 20 26.25C19.3096 26.25 18.75 26.8096 18.75 27.5C18.75 28.1904 19.3096 28.75 20 28.75Z" fill="#FA6E5A"/>
                <path d="M18.2322 5.73223L3.23223 30.7322C2.89156 31.3155 2.8734 32.0308 3.18483 32.6296C3.49626 33.2283 4.09494 33.6311 4.76777 33.6667H34.7678C35.4406 33.6311 36.0393 33.2283 36.3507 32.6296C36.6621 32.0308 36.644 31.3155 36.3033 30.7322L21.3033 5.73223C20.9424 5.15744 20.3548 4.7949 19.7177 4.7949C19.0807 4.7949 18.4931 5.15744 18.1322 5.73223H18.2322Z" stroke="#FA6E5A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {/* Número de emergências */}
            <div style={styles.text.count}>{count}</div>
            
            {/* Texto fixo de emergências */}
            <div style={styles.text.label}>EMERGÊNCIA(S)</div>
            
            {/* Botão VER com fundo escuro */}
            <Button 
              onClick={onClick}
              className={buttonClassName}
            >
              VER
            </Button>
          </div>
        ) : (
          /* Card de Próxima Consulta */
          <div className="flex flex-col h-full">
            {/* Cabeçalho */}
            <div className="p-4 pb-2">
              <h3 style={styles.text.title}>Próxima consulta:</h3>
                <p className="font-bold text-lg leading-tight" style={{ fontFamily: 'Inter, sans-serif', color: "#464646"}}>{name}</p>
              <div style={styles.text.info}>
                {date} - {time}
              </div>
            </div>
            
            {/* Botão VER com fundo laranja */}
            <div className="mt-auto p-4 pt-2 flex justify-end">
              <Button 
                onClick={onClick}
                className={buttonClassName}
              >
                VER
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InfoCard;
