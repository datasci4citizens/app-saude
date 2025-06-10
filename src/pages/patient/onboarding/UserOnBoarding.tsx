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
import { SuccessMessage } from "@/components/ui/success-message";
import {ErrorMessage} from "@/components/ui/error-message";

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
            <SuccessMessage message="Cadastro realizado com sucesso!" />
          )}

          {/* Error message display */}
          {error && (
            <ErrorMessage 
            message={error} 
            onClose={clearError}
            variant="destructive"
            />
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
