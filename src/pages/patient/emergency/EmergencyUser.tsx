import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input"; // deixar este text_input
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { ApiService } from "@/api/services/ApiService";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";
import { EmergencyService } from "@/api/services/EmergencyService";
import Header from "@/components/ui/header";
import type { ObservationCreate } from "@/api/models/ObservationCreate";

// Fetcher function for SWR
const fetcher = async (url: string) => {
  if (url === "providers") {
    return await LinkPersonProviderService.personProvidersList();
  }
  if (url === "user") {
    return await ApiService.apiUserEntityRetrieve();
  }
  throw new Error("Unknown fetcher URL");
};

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [freeText, setFreeText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data
  const {
    data: user,
    error: userError,
    isLoading: isUserLoading,
  } = useSWR("user", fetcher, {
    revalidateOnFocus: false,
  });

  // Fetch linked providers
  const {
    data: providers,
    error: providersError,
    isLoading: isProvidersLoading,
  } = useSWR(user ? "providers" : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.person_id) {
      console.error("User ID is missing");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create emergency observations for each selected provider
      const emergencyRequests: ObservationCreate[] = selectedProviders.map(
        (providerId) => ({
          person: user.person_id,
          provider: providerId,
          value_as_string: freeText || "Pedido de ajuda",
          observation_date: new Date().toISOString(),
          shared_with_provider: true,
        }),
      );

      // Send the emergency request
      await EmergencyService.emergencySendCreate(emergencyRequests);

      navigate("/user-main-page");
    } catch (error) {
      console.error("Erro ao enviar pedido de ajuda:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSelect = (providerId: number) => {
    setSelectedProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId],
    );
  };

  // Handle loading state
  if (isUserLoading || isProvidersLoading) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto p-4">
        <Header title="Pedido de ajuda" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray2">Carregando profissionais...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (providersError) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto p-4">
        <Header title="Pedido de ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-destructive">
            Erro ao carregar seus profissionais
          </p>
          <Button
            variant="orange"
            className="mt-4"
            onClick={() => navigate("/user-main-page")}
          >
            Voltar para tela inicial
          </Button>
        </div>
      </div>
    );
  }

  // Handle no linked providers
  if (providers && providers.length === 0) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto p-4">
        <Header title="Pedido de ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-gray2 mb-2">
            Você não possui profissionais vinculados
          </p>
          <p className="text-gray2 mb-4">
            Para enviar pedidos de ajuda, você precisa adicionar um
            profissional ao seu perfil.
          </p>
          <Button
            variant="orange"
            onClick={() => navigate("/patient/profile/add-professional")}
          >
            Adicionar profissional
          </Button>
        </div>
      </div>
    );
  }

return (
  <div className="flex flex-col h-screen max-w-md mx-auto p-4 bg-primary">
    <Header title="Pedido de ajuda" />

    <div className="flex items-center gap-3 mb-6"> {/* Added margin-bottom */}
      <span className="text-sm text-gray-500">
        Caso esteja passando por uma emergência ligue para 192. Esse pedido de ajuda não será atendido imediatamente.
      </span>
    </div>

    <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
      {/* Removed ml-8 from this div */}
      <div className="space-y-2">
        <h3 className="font-semibold text-[16px] font-inter text-typography"> {/* Added px-4 */}
          Quais profissionais você deseja alertar?
        </h3>
        <div className="flex flex-col gap-4">
          {providers &&
            providers.map((provider: ProviderRetrieve) => (
              <RadioCheckbox
                key={provider.provider_id}
                id={`provider-${provider.provider_id}`}
                label={
                  provider.social_name ||
                  provider.name ||
                  "Profissional sem nome"
                }
                checked={selectedProviders.includes(provider.provider_id)}
                onCheckedChange={() =>
                  handleProviderSelect(provider.provider_id)
                }
                className="px-4" // Added horizontal padding
              />
            ))}
        </div>
      </div>

      {/* Removed ml-8 and added px-4 */}
      <div className="space-y-2 px-4">
        <TextField
          size="large"
          multiline
          label="Mensagem"
          placeholder="Descreva seu pedido de ajuda..."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
      </div>

      {/* Changed px-8 to px-4 */}
      <div className="px-4 mt-auto pb-4">
        <Button
          variant="orange"
          size="responsive"
          type="submit"
          disabled={isSubmitting || !selectedProviders.length}
        >
          {isSubmitting ? "Enviando..." : "ENVIAR ALERTA"}
        </Button>
      </div>
    </form>
  </div>
);
}
