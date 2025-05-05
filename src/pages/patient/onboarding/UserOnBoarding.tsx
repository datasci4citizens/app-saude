import { useState } from 'react';
import { UserInfoForm } from '@/pages/patient/onboarding/UserInfoForm';
import { UserInfoForm2 } from '@/pages/patient/onboarding/UserInfoForm2';
import { UserInfoForm3 } from '@/pages/patient/onboarding/UserInfoForm3';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import useSWRMutation from 'swr/mutation';

// Empty placeholder for future service implementation
// Will create a placeholder service that matches the pattern you described
import { FullUserOnBoardingService } from '@/api/services/FullUserOnBoardingService';

// Define types for the incoming data from each form
interface PersonData {
  social_name?: string | null;
  birth_datetime?: string | null;
  gender_concept?: number | null;
  race_concept?: number | null;
  weight?: number | null;
  height?: number | null;
}

interface LocationData {
  address_1?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country_concept?: number;
}

interface HealthData {
  observations: Array<{
    value_as_string: string;
    observation_date: string;
    observation_concept: number;
    shared_with_provider: boolean;
  }>;
  drugExposures: Array<{
    sig: string;
    drug_exposure_start_date: string;
    drug_concept: number | null;
    drug_type_concept: number;
  }>;
}

// Master data structure that combines all form data
interface FullOnboardingData {
  person: PersonData;
  location: LocationData;
  healthData: HealthData;
}

export default function UserOnboarding() {
  const router = useNavigate();

  // Track form step and collected data
  const [step, setStep] = useState(1);
  const [personData, setPersonData] = useState<PersonData>({});
  const [locationData, setLocationData] = useState<LocationData>({});
  const [healthData, setHealthData] = useState<HealthData>({
    observations: [],
    drugExposures: []
  });
  const [error, setError] = useState<string | null>(null);

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    'fullUserOnboarding',
    async () => {
      const fullData: FullOnboardingData = {
        person: personData,
        location: locationData,
        healthData: healthData
      };
      
      try {
        // This will be replaced with the actual service call when implemented
        const result = await FullUserOnBoardingService.apiFullPersonOnBoardingCreate(fullData);
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

  const handleFirstFormSubmit = (data: PersonData) => {
    console.log('First form data submitted:', data);
    
    // Save person data
    setPersonData(data);
    setStep(2);
  };

  const handleSecondFormSubmit = (data: LocationData) => {
    console.log('Second form data:', data);
    
    // Save location data
    setLocationData(data);
    setStep(3);
  };

  const handleThirdFormSubmit = async (data: HealthData) => {
    console.log('Third form data:', data);
    
    // Save health data
    setHealthData(data);
    
    try {
      // Trigger the SWR mutation to send all data
      const result = await trigger();
      console.log('Submission result:', result);
      
      // Handle successful submission
      alert('Cadastro realizado com sucesso!');
      router('/user-main-page'); // Adjust the route as needed
    } catch (err) {
      console.error('Registration error:', err);
      // Error is already set in the mutation function
      alert(`Erro: ${error}`);
    }
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
        
        {/* Progress indicator - updated color */}
        <div className="mt-[30px] mb-6 mx-8">
          <div className="flex h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full w-1/3 ${step === 1 ? "bg-[#CEFA5A]" : "bg-transparent"}`}
            ></div>
            <div 
              className={`h-full w-1/3 ${step === 2 ? "bg-[#CEFA5A]" : "bg-transparent"}`}
            ></div>
            <div 
              className={`h-full w-1/3 ${step === 3 ? "bg-[#CEFA5A]" : "bg-transparent"}`}
            ></div>
          </div>
        </div>
        
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