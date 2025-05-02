import React, { useState } from 'react';
import ProfessionalInfoForm from '@/pages/provider/ProfessionalInfoForm';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Adjust the import based on your routing library
import Header from '@/components/ui/header';

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
        
      <div className="max-w-md mx-auto">
        {/* Replace custom back button and title with Header component */}
        <div className="px-8 pt-9">
          <Header title="Preencha informações sobre você"
            onBackClick={handleBackClick}
          />
        </div>
        
        <div className="pl-9 pr-9">
          {/* Use the form component here */}
          <ProfessionalInfoForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}