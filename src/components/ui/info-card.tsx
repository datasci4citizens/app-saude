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
          <div className="flex flex-col h-full ">
            {/* Conteúdo principal centralizado */}
            <div className="flex flex-col items-center pt-4">
              {/* Ícone de alerta */}
                <div className="mb-3 ">
                <span 
                  role='img' 
                  className="mgc_alert_diamond_line" 
                  style={{ fontSize: '60px', width: '60px', height: '60px', display: 'inline-block' }}
                ></span>
              </div>
              
              {/* Número de emergências */}
              <div style={styles.text.count}>{count}</div>
              
              {/* Texto fixo de emergências */}
              <div style={styles.text.label}>EMERGÊNCIA(S)</div>
            </div>
            
            {/* Container do botão alinhado à direita inferior */}
            <div className="mt-auto p-4 flex justify-end">
              <Button 
                className="rounded-full px-6 py-2 text-sm bg-[#141B36] text-white hover:bg-[#141B36]/90"
                onClick={onClick}
              >
                VER
              </Button>
            </div>
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
            <div className="mt-auto p-4 flex justify-end">
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
