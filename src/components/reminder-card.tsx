import React from 'react';

interface ReminderCardProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isChecked: boolean;
  onCheckboxChange: (checked: boolean) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  title,
  subtitle,
  icon,
  isChecked,
  onCheckboxChange
}) => {
  return (
    <div style={styles.container}>
      {/* Icon container */}
      <div style={styles.iconContainer}>
        {icon}
      </div>

      {/* Text content */}
      <div style={styles.textContainer}>
        <h4 style={styles.title}>{title}</h4>
        <p style={styles.subtitle}>{subtitle}</p>
      </div>

      {/* Checkbox */}
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckboxChange(e.target.checked)}
          style={styles.checkbox}
        />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9FF',
    borderRadius: '14px',
    padding: '16px',
    width: '100%',
    margin: '8px 0'
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAE7FF',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    color: '#6A5ACD'
  },
  textContainer: {
    flex: 1,
    marginLeft: '16px'
  },
  title: {
    fontSize: '16px',
    fontWeight: 'normal',
    margin: 0,
    color: '#141B36',
    fontFamily: '"Inter", sans-serif'
  },
  subtitle: {
    fontSize: '12px',
    margin: 0,
    color: '#A0A3B1',
    fontFamily: '"Inter", sans-serif'
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6A5ACD',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    color: 'white'
  },
  checkbox: {
    appearance: 'none',
    width: '24px',
    height: '24px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer'
  }
};

export default ReminderCard;