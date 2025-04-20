import React, {useState} from 'react';
import { UserInfoForm } from '@/components/forms/UserInfoForm';
import { UserInfoForm2 } from '@/components/forms/UserInfoForm2';
import { UserInfoForm3 } from '@/components/forms/UserInfoForm3';
// import { useRouter } from 'next/router'; // see how to connect to backend later

export default function UserOnboarding() {
  // const router = useRouter();

  // Track form step and collected data
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({});

  interface UserData {
    [key: string]: any;
  }

  interface FormSubmitHandler {
    (data: UserData): void;
  }

  const handleFirstFormSubmit: FormSubmitHandler = (data) => {
    console.log('First form data submitted:', data);
    // Save data and move to next form
    setUserData({ ...userData, ...data });
    setStep(2);
  };

  // Handle second form submission
  interface SecondFormData {
    [key: string]: any;
  }

  const handleSecondFormSubmit = (data: SecondFormData): void => {
    console.log('Second form data:', data);
    // Combine step 1 and step 2 data
    setUserData((prevData: UserData) => ({ ...prevData, ...data }));
    setStep(3);
  };

  // Handle third and last form submission
  interface ThirdFormData {
    [key: string]: any;
  }

  const handleThirdFormSubmit = (data: ThirdFormData): void => {
    console.log('Third form data:', data);
    
    // First update the state to include the third form data
    setUserData(prevData => ({ ...prevData, ...data }));
    
    // Then access the complete data (need to use callback pattern since state updates are asynchronous)
    setTimeout(() => {
      const completeUserData = { ...userData, ...data };
      console.log('COMPLETE USER DATA:', completeUserData);
      
      // Here you would send the data to your backend
      // apiService.submitUserData(completeUserData);
      
      alert('All forms submitted successfully!');
    }, 0);
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
        <div className="mt-[30px] mb-6 mx-8"> {/* Container with margins */}
            <div className="bg-gray-200 h-2 rounded-full w-full"> {/* Gray background bar */}
              <div
                className="h-2 rounded-full" 
                style={{
                  width: `${(step / 3) * 100}%`, // Adjust width based on step
                  backgroundColor: '#CEFA5A',
                }}
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
          {step === 1 ? (
              <UserInfoForm onSubmit={handleFirstFormSubmit} />
            ) : step === 2 ? (
              <UserInfoForm2 onSubmit={handleSecondFormSubmit} />
            ) : (
              <UserInfoForm3 onSubmit={handleThirdFormSubmit}/>
            )}
        </div>
      </div>
    </div>
  );
}

