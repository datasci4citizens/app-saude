import React, { useState } from 'react';
import ProfessionalInfoForm from '@/pages/provider/ProfessionalInfoForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Adjust the import based on your routing library

// Define the data type we expect from the form
interface ProfessionalData {
  civilName: string;
  socialName: string;
  professionalEmail: string;
  registrationNumber: string;
  document: File | null;
  [key: string]: any;
}

export default function ProfessionalOnboarding() {
  // Handle form submission
  const router = useNavigate();
  // In ProfessionalOnboarding.tsx
  const handleFormSubmit = async (data: ProfessionalData) => {
    console.log('Professional data submitted:', data);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        'http://api.example.com/professionals/register',
        data,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Handle response
      if (response.status === 200 || response.status === 201) {
        alert('Cadastro realizado com sucesso!');
        router('/acs-main-page'); // Redirect to the main page
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                           'Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.';
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto" style={{height: '100vh'}}>
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button className="pt-9 pl-8" onClick={() => window.history.back()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#141B36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        {/* Form title */}
        <div className="pl-9 mt-[46px] mb-6">
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif', color: '#141B36' }}> 
              Preencha informações sobre você
            </h1>
        </div>
        
        <div className="pl-9 pr-9">
          {/* Use the form component here */}
          <ProfessionalInfoForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}