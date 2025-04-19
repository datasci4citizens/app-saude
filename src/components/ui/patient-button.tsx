import React, { useState } from 'react';

interface PatientButtonProps {
    variant?: 'patient' | 'emergency';
    name: string; 
    age?: number;
    lastConsult: string;
    lastRegistry: string;
    lastEmergency: string;
    active?: boolean;
    onClick?: () => void;
    onClickEmergency?: () => void;
}

const PatientButton: React.FC<PatientButtonProps> = ({
    variant = 'patient',
    name,
    age,
    lastConsult,
    lastRegistry,
    lastEmergency,
    active = false,
    onClick,
    onClickEmergency
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const isEmergency = variant === 'emergency';
    
    return (
        <div 
            style={{
                ...styles.container,
                backgroundColor: isEmergency ? '#FA6E5A' : '#FFFFFF',
                transform: isHovered ? 'translateY(-2px)' : 'none',
                boxShadow: isHovered 
                    ? '0 6px 12px rgba(0, 0, 0, 0.15)' 
                    : '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div style={styles.content}>
                <div style={{
                    ...styles.name,
                    color: isEmergency ? '#FFFFFF' : '#000000'
                }}>
                    {name}{age ? `- ${age} anos` : ''}
                </div>
                <div style={{
                    ...styles.infoText,
                    color: isEmergency ? '#FFFFFF' : '#000000'
                }}>
                    Última consulta: {lastConsult}
                </div>
                <div style={{
                    ...styles.infoText,
                    color: isEmergency ? '#FFFFFF' : '#000000'
                }}>
                    Último registro compartilhado: {lastRegistry}
                </div>
                {isEmergency ? (
                    <div 
                        style={styles.emergencyAlert}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onClickEmergency) onClickEmergency();
                        }}
                    >
                        EMERGÊNCIA ATIVA DESDE {lastEmergency}
                    </div>
                ) : (
                    <div style={{
                        ...styles.infoText,
                        color: isEmergency ? '#FFFFFF' : '#000000'
                    }}>
                        Última emergência: {lastEmergency}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        // falta normalzar a margem de todos os itens
        width: '100%',
        maxWidth: '600px',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
        fontFamily: "'Work Sans', sans-serif",
    },
    infoText: {
        fontSize: 13,
        marginBottom: 2,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 400,
    },
    emergencyAlert: {
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 6,
        fontSize: 13,
        fontFamily: "'Inter', sans-serif",
    }
};

export default PatientButton;
