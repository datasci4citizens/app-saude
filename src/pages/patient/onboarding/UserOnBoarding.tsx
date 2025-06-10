import { useState } from "react";
import { UserInfoForm } from "@/pages/patient/onboarding/UserInfoForm";
import { UserInfoForm2 } from "@/pages/patient/onboarding/UserInfoForm2";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import useSWRMutation from "swr/mutation";
import type { PersonCreate } from "@/api/models/PersonCreate";
import type { LocationCreate } from "@/api/models/LocationCreate";
import { ProgressIndicator } from "@/components/forms/progress_indicator";
import { FullPersonService } from "@/api/services/FullPersonService";
import type { FullPersonCreate } from "@/api/models/FullPersonCreate";
import type { AddressFormData } from "@/pages/patient/onboarding/UserInfoForm2";
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
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    "fullPersonOnboarding",
    async () => {
      const fullData: FullPersonCreate = {
        person,
        location,
        observations: [], // we don't gather this data
        drug_exposures: [], // we don't gather this data
      };
      return await FullPersonService.apiFullPersonCreate(fullData);
    },
  );

  const handleFirstFormSubmit = (data: PersonData) => {
    console.log("First form data submitted:", data);

    // Save person data
    const person: PersonCreate = {
      social_name: data.social_name,
      birth_datetime: data.birth_datetime,
      year_of_birth: new Date(data.birth_datetime || "").getFullYear(),
      gender_concept: data.gender_concept,
      ethnicity_concept: 3, // fill
      race_concept: data.race_concept,
    };
    setPerson(person);
    setStep(2);
  };

  const handleSecondFormSubmit = async (data: AddressFormData) => {
    console.log("Second form data:", data);

    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    // Save location data
    setLocation(data);
    try {
      // Create the submission data with the updated location
      const fullData: FullPersonCreate = {
        person,
        location: data,
        observations: [],
        drug_exposures: [],
      };

      const result = await FullPersonService.apiFullPersonCreate(fullData);
      console.log("Submission result:", result);
      
      setSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate delay

      router("/user-main-page");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Erro ao realizar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleBackClick = (): void => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      // Handle back on first screen (could redirect or show confirmation)
      console.log("On first step, nowhere to go back");
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div
      className="h-full bg-primary overflow-y-auto"
      style={{ height: "100vh" }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-8 pt-9">
          <Header
            title="Preencha informações sobre você"
            onBackClick={handleBackClick}
          />
        </div>

        {/* Progress indicator*/}
        <ProgressIndicator currentStep={step} totalSteps={2} />

        <div className="pl-9 pr-4">
          {/* Success message - show above error */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 mt-4 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm font-medium">Cadastro realizado com sucesso! Redirecionando...</p>
              </div>
            </div>
          )}

          {/* Error message display */}
          {error && (
            <div className="bg-destructive border border-destructive rounded-lg p-4 text-white mt-4 mb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm">{error}</p>
                </div>
                <button
                  onClick={clearError}
                  className="text-white hover:text-white text-lg font-bold ml-2"
                  aria-label="Fechar erro"
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="mt-2">
                <button
                  onClick={clearError}
                  className="text-sm text-white hover:text-white underline"
                  type="button"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          )}

          {isMutating ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selected"></div>
            </div>
          ) : step === 1 ? (
            <UserInfoForm onSubmit={handleFirstFormSubmit} />
          ) : (
            <UserInfoForm2 onSubmit={handleSecondFormSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
