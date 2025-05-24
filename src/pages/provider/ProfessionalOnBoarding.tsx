import React, { useState } from "react";
import { ProfessionalInfoForm } from "@/pages/provider/ProfessionalInfoForm";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import useSWRMutation from "swr/mutation";
import type { FullProviderCreate } from "@/api/models/FullProviderCreate";
import { ApiService, type ProviderCreate } from "@/api";
import { FullProviderService } from "@/api/services/FullProviderService";

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

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    "fullProviderOnboarding",
    async () => {
      const fullData: FullProviderCreate = {
        provider,
      };
      return await FullProviderService.apiFullProviderCreate(fullData);
    },
  );

  // Handle form submission
  const handleFormSubmit = async (data: ProviderData) => {
    console.log("Professional data submitted:", data);

    const provider: ProviderCreate = {
      social_name: data.social_name,
      birth_datetime: data.birth_datetime,
      professional_registration: data.professional_registration,
      specialty_concept: data.specialty_concept,
      // will be null for now
      care_site: null,
    };
    // save provider data
    setProvider(provider);
    // delay ate os dados estarem completados

    // Exemplo de como recuperar o ID
    const fetchUserEntity = async () => {
      try {
        const result = await ApiService.apiUserEntityRetrieve();
        console.log("User entity result:", result);

        if (result.person_id) {
          alert(
            `Cadastro realizado com sucesso! Seu Person ID é: ${result.person_id}`,
          );
        } else if (result.provider_id) {
          alert(
            `Cadastro realizado com sucesso! Seu Provider ID é: ${result.provider_id}`,
          );
        } else {
          alert("Cadastro realizado com sucesso, mas nenhum ID foi retornado.");
        }

        navigate("/acs-main-page"); // Redireciona para a página principal
      } catch (err) {
        console.error("Erro ao buscar entidade do usuário:", err);
        alert("Erro ao buscar entidade do usuário.");
      }
    };

    setTimeout(async () => {
      try {
        // Trigger the SWR mutation with form data
        const result = await trigger();
        console.log("Submission result:", result);

        await fetchUserEntity();
      } catch (err) {
        console.error("Registration error:", err);
        // Error is already set in the mutation function
        alert(`Erro: ${error}`);
      }
    }, 0);
  };

  // Handle back button click
  const handleBackClick = (): void => {
    // Could redirect to login or previous page
    navigate(-1); // Go back to previous page
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
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-md p-3 mb-4">
              <p>{error}</p>
            </div>
          )}

          {isMutating ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selected"></div>
            </div>
          ) : (
            <ProfessionalInfoForm onSubmit={handleFormSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}
