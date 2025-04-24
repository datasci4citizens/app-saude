import React, {useState} from 'react';
import { UserInfoForm } from '@/components/forms/UserInfoForm';
import { UserInfoForm2 } from '@/components/forms/UserInfoForm2';
import { UserInfoForm3 } from '@/components/forms/UserInfoForm3';
import  axios from 'axios';
import { useNavigate } from 'react-router-dom'; // see how to connect to backend later

export default function UserOnboarding() {
  const router = useNavigate();

  // Track form step and collected data
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(
    localStorage.getItem('authToken')
  );


  interface UserData {
    [key: string]: any;
  }

  interface FormSubmitHandler {
    (data: UserData): void;
  }

  const handleFirstFormSubmit: FormSubmitHandler = async (data) => {
    console.log('First form data submitted:', data);

    // Save data and move to next form
    setUserData({ ...userData, ...data });
    console.log('User data after first form:', userData);
    setStep(2);
    
  };

  const handleSecondFormSubmit = async (data: SecondFormData): Promise<void> => {
      
      console.log('Second form data:', data);
      // Combine step 1 and step 2 data
      setUserData((prevData: UserData) => ({ ...prevData, ...data }));
      setStep(3);
  };

  // Handle third and last form submission
  interface ThirdFormData {
    [key: string]: any;
  }

  const handleThirdFormSubmit = async (data: ThirdFormData): Promise<void> => {
    console.log('Third form data:', data);

    // First update the state to include the third form data
    const updatedUserData = { ...userData, ...data };
    setUserData(updatedUserData);

    // Prepare to send data to backend
    setLoading(true);
    setError(null);

    try {
      // API call to register user
      interface ApiResponse {
        token?: string;
        [key: string]: any;
      }

      const response = await axios.post<ApiResponse>(
        'http://localhost:8000/api/person/', 
        updatedUserData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
          }
        }
      );

      console.log('API Response:', response.data);

      // Handle successful registration
      if (response.status === 200 || response.status === 201) {
        // Optional: Save auth token if returned
        if (response.data.token) {
          localStorage.setItem('authToken', response.data.token);
        }

        alert('Cadastro realizado com sucesso!');
        // Redirect user to appropriate page
        router('/user-main-page'); // Adjust the route as neededs
      }
    } catch (err: any) {
      console.error('Registration error:', err);

      // Extract error message from response if available
      const errorMessage = err.response?.data?.message || 
                          'Ocorreu um erro ao processar seu cadastro. Tente novamente mais tarde.';

      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
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
        {/* Back button */}
        <button className="pt-9 pl-8" onClick={() => handleBackClick()}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#141B36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
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
        
        {/* Form title - updated font and color */}
        <div className="pl-9 mt-[46px] mb-6">
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif', color: '#141B36' }}> 
              Preencha informações sobre você
            </h1>
        </div>
        
        <div className="pl-9 pr-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-3 mb-4">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
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

