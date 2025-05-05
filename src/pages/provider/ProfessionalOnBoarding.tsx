import React, { useState } from 'react';
import { ProfessionalInfoForm } from '@/pages/provider/ProfessionalInfoForm';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import useSWRMutation from 'swr/mutation';

// Import the service (this will be created)
import { FullProviderOnBoardingService } from '@/api/services/FullProviderOnBoardingService';

// Define the provider data type with proper backend field naming (snake_case)
interface ProviderData {
  social_name?: string | null;
  birth_datetime?: string | null;
  professional_registration?: number | null;
  specialty_concept?: number | null;
  professional_email?: string | null;
  civil_name?: string | null;
  document?: File | null;
}

export default function ProfessionalOnboarding() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    'fullProviderOnboarding',
    async (_: string, { arg }: { arg: ProviderData }) => {
      try {
        // Call the service with the form data
        const result = await FullProviderOnBoardingService.apiFullProviderOnBoardingCreate(arg);
        return result;
      } catch (err: any) {
        // Extract error message
        const errorMessage = err.message || 
          'Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.';
        setError(errorMessage);
        throw err;
      }
    }
  );

  // Handle form submission
  const handleFormSubmit = async (data: ProviderData) => {
    console.log('Professional data submitted:', data);
    
    try {
      // Trigger the SWR mutation with form data
      const result = await trigger(data);
      console.log('Submission result:', result);
      
      // Handle successful submission
      alert('Cadastro realizado com sucesso!');
      navigate('/acs-main-page'); // Redirect to the main page
    } catch (err) {
      console.error('Registration error:', err);
      // Error is already set in the mutation function
      alert(`Erro: ${error}`);
    }
  };

  // Handle back button click
  const handleBackClick = (): void => {
    // Could redirect to login or previous page
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="h-full bg-white overflow-y-auto" style={{height: '100vh'}}>
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="px-8 pt-9">
          <Header 
            title="Preencha informações profissionais" 
            onBackClick={handleBackClick}
          />
        </div>
        
        <div className="pl-9 pr-9">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
              <p>{error}</p>
            </div>
          )}

          {isMutating ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CEFA5A]"></div>
            </div>
          ) : (
            <ProfessionalInfoForm onSubmit={handleFormSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}