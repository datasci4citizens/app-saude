import React, { useState } from 'react';
import Header from '../components/header';
import Card from '../components/reminder-card';

const Reminders: React.FC = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);

  const dates = Array.from({ length: 20 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      iso: date.toISOString().split('T')[0],
      display: `${date.toLocaleString('default', { month: 'short' }).toUpperCase()} ${date.getDate()}`
    };
  });

  return (
    <div style={styles.page}>
      {/* Header */}
      <Header
        title="Hoje, dia 19/04"
        onBackClick={() => console.log('Navigate back')}
        rightIcon={<span style={styles.editIcon} className="mgc-pencil-line" />}
      />

      {/* Horizontal Scrollable Date List */}
      <div style={styles.dateListContainer}>
        {dates.map((date) => (
          <div
            key={date.iso}
            style={{
              ...styles.dateBox,
              backgroundColor: date.iso === selectedDate ? '#FA6E5A' : '#F9F9FF'
            }}
            onClick={() => setSelectedDate(date.iso)}
          >
            <h5>{date.display}</h5>
          </div>
        ))}
      </div>

      {/* Consultations Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Consultas</h2>
          <span style={styles.editIcon} className="mgc-pencil-line" />
        </div>
        <hr style={styles.divider} />
        <Card
          title="Consulta com psiquiatra"
          subtitle="Dia 3 de maio, às 13:45"
          icon={<span className="mgc-user-line" />}
          isChecked={true}
          onCheckboxChange={(checked) => console.log('Consulta checkbox:', checked)}
        />
      </div>

      {/* Medications Section */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Medicamentos</h2>
          <span style={styles.editIcon} className="mgc-pencil-line" />
        </div>
        <hr style={styles.divider} />
        <Card
          title="Pimozida"
          subtitle="Em 2 horas e 51 minutos"
          icon={<span className="mgc-pill-line" />}
          isChecked={true}
          onCheckboxChange={(checked) => console.log('Pimozida checkbox:', checked)}
        />
        <Card
          title="Sertralina"
          subtitle="Em 2 horas e 51 minutos"
          icon={<span className="mgc-pill-line" />}
          isChecked={true}
          onCheckboxChange={(checked) => console.log('Sertralina checkbox:', checked)}
        />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    padding: '16px',
    backgroundColor: '#FFFFFF',
    minHeight: '100vh',
    fontFamily: '"Inter", sans-serif'
  },
  editIcon: {
    fontSize: '18px',
    color: '#6A5ACD',
    cursor: 'pointer'
  },
  dateListContainer: {
    display: 'flex',
    overflowX: 'scroll',
    gap: '12px',
    margin: '16px 0',
    padding: '8px 0'
  },
  dateBox: {
    flexShrink: 0,
    width: '48px',
    height: '72px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#141B36',
  },
  section: {
    marginTop: '24px'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
    color: '#222'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(173, 184, 217, 0.2)',
    marginBottom: '12px'
  }
};

export default Reminders;