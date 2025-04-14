import React from 'react';
import { UserInfoForm } from '@/components/forms/UserInfoForm';
// import { useRouter } from 'next/router'; // see how to connect to backend later

export default function UserOnboarding() {
  // const router = useRouter();

  const handleFormSubmit = (data) => {
    console.log('Form data submitted:', data);
    // Save user data to your backend or context
    // Then navigate to the next screen
    // router.push('/next-onboarding-step');
    alert('Form submitted! Check console for data.');
  };

  return (
    <div className="h-full bg-white overflow-y-auto" style={{height: '100vh'}}>
      <div className="max-w-md mx-auto">
        {/* Back button */}
        <button className="pt-9 pl-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#141B36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        
        {/* Progress indicator - updated color */}
        <div className="mt-[30px] mb-6 mx-8"> {/* Container with margins */}
            <div className="bg-gray-200 h-2 rounded-full w-full"> {/* Gray background bar */}
              <div
                className="h-2 rounded-full" 
                style={{ width: '30%', backgroundColor: '#CEFA5A' }}
              ></div>
            </div>
        </div>
        
        {/* Form title - updated font and color */}
        <div className="pl-9 mt-[46px] mb-6">
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif', color: '#141B36' }}> 
              Preencha informações sobre você
            </h1>
        </div>
        
        <div className="px-4">
          <UserInfoForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  );
}