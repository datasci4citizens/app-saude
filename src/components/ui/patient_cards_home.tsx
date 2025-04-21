import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type MedicationItem = {
  name: string;
  date: string;
};

type AppointmentItem = {
  name: string;
  date: string;
};

type PatientCardVariant = 'medicine' | 'appointment';

interface PatientCardProps {
  variant: PatientCardVariant;
  title?: string;
  items?: MedicationItem[] | AppointmentItem[];
  onClick?: () => void;
}

const styles = {
  card: {
    base: {
      width: '38%',
      borderRadius: '12px',
      background: '#F9F9FF'
    }
  },
  text: {
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      fontFamily: 'Inter, sans-serif',
      color: '#464646',
      marginBottom: '12px'
    },
    item: {
      fontSize: '12px',
      fontFamily: 'Inter, sans-serif',
      color: '#464646',
      marginBottom: '8px'
    },
    date: {
      fontWeight: 'bold'
    }
  }
};

const PatientCard: React.FC<PatientCardProps> = ({
  variant,
  title,
  items = [],
  onClick
}) => {
  // Limit to 3 items max
  const displayedItems = items.slice(0, 3);
  const cardTitle = title || (variant === 'medicine' ? 'Remédios' : 'Consultas');

  return (
    <Card 
      className="overflow-hidden"
      style={styles.card.base}
    >
      <CardContent className="p-0">
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <h3 style={styles.text.title}>{cardTitle}</h3>
          
          {/* Items list */}
          <div className="flex-1">
            {displayedItems.map((item, index) => (
              <div key={index} style={styles.text.item}>
                <span>{item.name}</span>
                <br />
                <span style={styles.text.date}>{item.date}</span>
              </div>
            ))}
          </div>
          
          {/* Button */}
          <div className="flex justify-end pt-2">
            <Button 
              onClick={onClick}
              className="rounded-full px-6 py-2 text-sm bg-[#FA6E5A] text-white hover:bg-[#FA6E5A]/90"
            >
              VER
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientCard;