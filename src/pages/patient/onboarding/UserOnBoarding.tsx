import { useState } from 'react';
import { UserInfoForm } from '@/pages/patient/onboarding/UserInfoForm';
import { UserInfoForm2 } from '@/pages/patient/onboarding/UserInfoForm2';
import { UserInfoForm3 } from '@/pages/patient/onboarding/UserInfoForm3';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import useSWRMutation from 'swr/mutation';
import type { PersonCreate } from '@/api/models/PersonCreate';
import type { LocationCreate } from '@/api/models/LocationCreate';
import type { ObservationCreate } from '@/api/models/ObservationCreate';
import type { DrugExposureCreate } from '@/api/models/DrugExposureCreate';
import { ProgressIndicator } from '@/components/forms/progress_indicator';
import type { FullPersonRetrieve } from '@/api/models/FullPersonRetrieve';

// Empty placeholder for future service implementation
// Will create a placeholder service that matches the pattern you described
import { FullPersonService } from '@/api/services/FullPersonService';
import type { FullPersonCreate } from '@/api/models/FullPersonCreate';

import type { AddressFormData } from '@/pages/patient/onboarding/UserInfoForm2';
import type { SubmissionData } from '@/pages/patient/onboarding/UserInfoForm3';

// Define types for the incoming data from each form
interface PersonData {
  social_name?: string | null;
  birth_datetime?: string | null;
  gender_concept?: number | null;
  race_concept?: number | null;
  weight?: number | null;
  height?: number | null;
}

export default function UserOnboarding() {
  const router = useNavigate();

  // Track form step and collected data
  const [step, setStep] = useState(1);
  const [person, setPerson] = useState<PersonCreate>({});
  const [location, setLocation] = useState<LocationCreate>({});
  const [observations, setObservations] = useState<ObservationCreate[]>([]);
  const [drugExposures, setDrugExposures] = useState<DrugExposureCreate[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation('fullPersonOnboarding', async () => {
    const fullData: FullPersonCreate = {
      person,
      location,
      observations,
      drug_exposures: drugExposures,
    }
    return await FullPersonService.apiFullPersonCreate(fullData);
  });

  const handleFirstFormSubmit = (data: PersonData) => {
    console.log('First form data submitted:', data);
    
    // Save person data
    const person: PersonCreate = {
      social_name: data.social_name,
      birth_datetime: data.birth_datetime,
      year_of_birth: new Date(data.birth_datetime || '').getFullYear(),
      gender_concept: data.gender_concept,
      ethnicity_concept: 3,// fill
      race_concept: data.race_concept
    };
    setPerson(person);
    setStep(2);
  };

  const handleSecondFormSubmit = (data: AddressFormData) => {
    console.log('Second form data:', data);
    
    // Save location data
    setLocation(data);
    setStep(3);
  };

  const handleThirdFormSubmit = async (data: SubmissionData) => {
    console.log('Third form data:', data);
    
    // Save health data
    setObservations(data.observations);
    setDrugExposures(data.drugExposures);

    // Delay a chamada até que os dados estejam atualizados
    setTimeout(async () => {
      try {
        const result = await trigger();
        console.log('Submission result:', result);
        alert('Cadastro realizado com sucesso!');
        router('/user-main-page');
      } catch (err) {
        console.error('Registration error:', err);
        alert(`Erro: ${error}`);
      }
    }, 0); // Executa na próxima "pintura"
  };

  // Handle back button click
  const handleBackClick = (): void => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Handle back on first screen (could redirect or show confirmation)
      console.log('On first step, nowhere to go back');
    }
  };

  return (
    <div className="h-full bg-white overflow-y-auto" style={{height: '100vh'}}>
      <div className="max-w-md mx-auto">

        {/* Header */}
        <div className="px-8 pt-9">
          <Header title="Preencha informações sobre você"
            onBackClick={handleBackClick}
          />
        </div>
        
        {/* Progress indicator*/}
        <ProgressIndicator 
          currentStep={step} 
          totalSteps={3} 
        />
        
        <div className="pl-9 pr-4">
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
            step === 1 ? (
              <UserInfoForm onSubmit={handleFirstFormSubmit} />
            ) : step === 2 ? (
              <UserInfoForm2 onSubmit={handleSecondFormSubmit} />
            ) : (
              <UserInfoForm3 onSubmit={handleThirdFormSubmit} />
            )
          )}
        </div>
      </div>
    </div>
  );
}