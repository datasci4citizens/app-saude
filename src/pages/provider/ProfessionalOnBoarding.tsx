import React, { useState } from "react";
import { ProfessionalInfoForm } from "@/pages/provider/ProfessionalInfoForm";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import useSWRMutation from "swr/mutation";
import type { FullProviderCreate } from "@/api/models/FullProviderCreate";
import { ApiService, type ProviderCreate } from "@/api";
import { FullProviderService } from "@/api/services/FullProviderService";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";

// Define the provider data type with proper backend field naming (snake_case)
interface ProviderData {
  social_name?: string | null;
  birth_datetime?: string | null;
  professional_registration?: number | null;
  specialty_concept?: number | null;
  care_site?: number | null;
  document?: File | null;
}

export default function ProfessionalOnboarding() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState<ProviderCreate>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    "fullProviderOnboarding",
    async (key, { arg }: { arg: ProviderCreate }) => {
      const fullData: FullProviderCreate = {
        provider: arg,
      };
      console.log("Submitting full provider data:", fullData);
      return await FullProviderService.apiFullProviderCreate(fullData);
    },
  );

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const messageRules: {
    match: (msg: string) => boolean;
    translation: string;
  }[] = [
    {
      match: (msg) =>
        msg.toLowerCase().includes("professional registration") &&
        msg.toLowerCase().includes("exists"),
      translation:
        "Já existe o cadastro de um profissional com esse número CNES",
    },
    // adicione outras regras conforme necessário
  ];

  function translateMessageFlex(msg: string): string {
    const rule = messageRules.find((r) => r.match(msg));
    return rule ? rule.translation : msg;
  }

  const fieldTranslation: Record<string, string> = {
    "provider.professional_registration": "Número CNES",
    // etc.
  };

  function translateField(field: string): string {
    return fieldTranslation[field] || field;
  }

  function flattenErrors(errors: any, prefix = ""): string[] {
    return Object.entries(errors).flatMap(([field, value]) => {
      const fieldPath = prefix ? `${prefix}.${field}` : field;

      if (Array.isArray(value)) {
        return value.map((msg) => {
          return `${translateField(fieldPath)}: ${translateMessageFlex(msg)}`;
        });
      } else if (typeof value === "string") {
        return [`${translateField(fieldPath)}: ${translateMessageFlex(value)}`];
      } else if (typeof value === "object" && value !== null) {
        return flattenErrors(value, fieldPath);
      } else {
        return [`${translateField(fieldPath)}: Erro desconhecido`];
      }
    });
  }

  // Handle form submission
  const handleFormSubmit = async (data: ProviderData) => {
    console.log("Professional data submitted:", data);

    // Clear previous states
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const provider: ProviderCreate = {
      social_name: data.social_name,
      birth_datetime: data.birth_datetime,
      professional_registration: data.professional_registration ?? undefined,
      specialty_concept: data.specialty_concept,
      care_site: null,
      profile_picture: localStorage.getItem("profileImage") || "",
    };

    // Save provider data
    console.log("Setting provider data:", provider);
    setProvider(provider);

    // Function to fetch user entity and show success
    const fetchUserEntity = async () => {
      try {
        const result = await ApiService.apiUserEntityRetrieve();
        console.log("User entity result:", result);

        if (result.person_id) {
          setSuccess(
            `Cadastro realizado com sucesso! Seu Person ID é: ${result.person_id}`,
          );
        } else if (result.provider_id) {
          setSuccess(
            `Cadastro realizado com sucesso! Seu Provider ID é: ${result.provider_id}`,
          );
        } else {
          setSuccess("Cadastro realizado com sucesso!");
        }

        // Wait to show success message, then navigate
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate("/acs-main-page");
      } catch (err) {
        console.error("Erro ao buscar entidade do usuário:", err);
        setError("Erro ao buscar informações do usuário após o cadastro.");
      }
    };

    try {
      // Create provider data
      const providerData: ProviderCreate = {
        social_name: data.social_name,
        birth_datetime: data.birth_datetime,
        professional_registration: data.professional_registration,
        specialty_concept: data.specialty_concept,
        care_site: null,
        profile_picture: localStorage.getItem("profileImage") || "",
      };

      // Save provider data to state (for other purposes if needed)
      setProvider(providerData);

      // Pass the data directly to trigger
      const result = await trigger(providerData);
      console.log("Submission result:", result);
      await fetchUserEntity();
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        "Erro ao realizar cadastro profissional. Verifique os dados e tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleBackClick = (): void => {
    navigate("/welcome"); // Go back to previous page
  };

  return (
    <div
      className="h-full bg-background overflow-y-auto"
      style={{ height: "100vh" }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-8 pt-9">
          <Header
            title="Preencha informações profissionais"
            onBackClick={handleBackClick}
          />
        </div>

        <div className="pl-9 pr-9">
          {/* Success Message */}
          {success && <SuccessMessage message={success} className="mb-4" />}

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onClose={clearError}
              onRetry={clearError}
              variant="destructive"
              className="mb-4"
            />
          )}

          {/* Loading State */}
          {(isMutating || isSubmitting) && !success ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selected mb-4"></div>
              <p className="text-typography text-sm text-center">
                {success
                  ? "Finalizando cadastro..."
                  : "Processando dados profissionais..."}
              </p>
            </div>
          ) : !success ? (
            <ProfessionalInfoForm onSubmit={handleFormSubmit} />
          ) : null}

          {/* Show success state with option to navigate manually */}
          {success && (
            <div className="text-center mt-6">
              <p className="text-typography text-sm mb-4">
                Redirecionando para a página principal...
              </p>
              <button
                onClick={() => navigate("/acs-main-page")}
                className="px-6 py-2 bg-selected hover:bg-selected/80 rounded-full text-accent2 font-medium transition-colors"
              >
                Ir para página principal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
