import React, { useState } from 'react';

const EntryOptionsScreen = ({ onComplete }) => {
  const [userType, setUserType] = useState(null);
  
  const handleContinue = () => {
    if (userType) {
      onComplete(userType);
    }
  };
  
  return (
    <div className="onboarding-screen entry-options-screen">
      <div className="content">
        <h1>Entrar como:</h1>
        
        <div className="options-container">
          <label className="radio-option">
            <input 
              type="radio" 
              name="userType" 
              value="patient" 
              checked={userType === 'patient'} 
              onChange={() => setUserType('patient')} 
            />
            <span className="radio-label">Usuário/paciente</span>
          </label>
          
          <label className="radio-option">
            <input 
              type="radio" 
              name="userType" 
              value="professional" 
              checked={userType === 'professional'} 
              onChange={() => setUserType('professional')} 
            />
            <span className="radio-label">Profissional de saúde ou ACS</span>
          </label>
        </div>
        
        <button 
          className={`primary-button ${!userType ? 'disabled' : ''}`} 
          onClick={handleContinue}
          disabled={!userType}
        >
          CONTINUAR
        </button>
        
        <div className="progress-indicator">
          <div className="indicator" />
          <div className="indicator" />
          <div className="indicator active" />
        </div>
      </div>
    </div>
  );
};

export default EntryOptionsScreen;