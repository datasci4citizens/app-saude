import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input"; // deixar este text_input
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { ApiService } from "@/api/services/ApiService";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";
import { HelpService } from "@/api/services/HelpService";
import Header from "@/components/ui/header";
import type { ObservationCreate } from "@/api/models/ObservationCreate";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";
import BottomNavigationBar from "@/components/ui/navigator-bar";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch user data
  const { data: user, isLoading: isUserLoading } = useSWR("user", fetcher, {
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

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.person_id) {
      setError("ID do usuário não encontrado. Tente recarregar a página.");
      return;
    }

    if (selectedProviders.length === 0) {
      setError(
        "Selecione pelo menos um profissional para enviar o pedido de ajuda.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Create emergency observations for each selected provider
      const emergencyRequests: ObservationCreate[] = selectedProviders.map(
        (providerId) => ({
          person: user.person_id,
          provider: providerId,
          value_as_string: freeText || "Pedido de Ajuda",
          observation_date: new Date().toISOString(),
          shared_with_provider: true,
        }),
      );

      // Send the emergency request
      await HelpService.helpSendCreate(emergencyRequests);

      // Show success message
      const providerCount = selectedProviders.length;
      const providerText =
        providerCount === 1 ? "profissional" : "profissionais";
      setSuccess(
        `Pedido de ajuda enviado com sucesso para ${providerCount} ${providerText}!`,
      );

      // Clear form
      setSelectedProviders([]);
      setFreeText("");

      // Navigate after showing success message
      setTimeout(() => {
        navigate("/user-main-page");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao enviar pedido de ajuda:", error);

      // Handle different types of errors
      if (error?.response?.status === 400) {
        setError(
          "Dados inválidos. Verifique as informações e tente novamente.",
        );
      } else if (error?.response?.status === 404) {
        setError("Profissional não encontrado. Tente atualizar a página.");
      } else if (error?.response?.status >= 500) {
        setError("Erro no servidor. Tente novamente em alguns minutos.");
      } else if (error?.message) {
        setError(`Erro ao enviar pedido de ajuda: ${error.message}`);
      } else {
        setError(
          "Erro ao enviar pedido de ajuda. Verifique sua conexão e tente novamente.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/user-main-page")) return "home";
    if (location.pathname.startsWith("/reminders")) return "meds";
    if (location.pathname.startsWith("/diary")) return "diary";
    if (location.pathname.startsWith("/emergency-user")) return "emergency";
    if (location.pathname.startsWith("/profile")) return "profile";
    return null;
  };

  const handleNavigationClick = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/user-main-page");
        break;
      case "meds":
        navigate("/reminders");
        break;
      case "diary":
        navigate("/diary");
        break;
      case "emergency":
        navigate("/emergency-user");
        break;
      case "profile":
        navigate("/profile");
        break;
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
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="text-gray2">Carregando profissionais...</p>
          </div>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  // Handle error state
  if (providersError) {
    return (
      <div className="flex flex-col h-screen max-w-md mx-auto p-4">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <ErrorMessage
            message="Erro ao carregar seus profissionais vinculados."
            variant="destructive"
            onRetry={() => window.location.reload()}
            className="mb-4"
          />
          <Button
            variant="orange"
            className="mt-4"
            onClick={() => navigate("/user-main-page")}
          >
            Voltar para tela inicial
          </Button>
        </div>
                <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  // Handle no linked providers
  if (providers && providers.length === 0) {
    return (
      <div className="p-4 flex flex-col bg-primary min-h-screen font-inter relative">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-gray2 mb-2 text-lg font-medium">
              Nenhum profissional vinculado
            </p>
            <p className="text-gray2 mb-4 text-sm">
              Para enviar alertas de pedidos de ajuda, você precisa adicionar um
              profissional ao seu perfil.
            </p>
          </div>
          <Button
            variant="orange"
            onClick={() => navigate("/add-professional")}
          >
            Adicionar profissional
          </Button>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col bg-primary min-h-screen font-inter relative">
      <Header title="Pedido de Ajuda" />

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

      {/* Emergency Disclaimer */}
      <div className="mb-6 p-4 bg-destructive bg-opacity-10 border border-destructive rounded-lg">
        <div className="flex items-start gap-2">
          <div className="text-white text-xl font-bold">⚠️</div>
          <div>
            <p className="text-white font-semibold text-sm mb-2">
              ATENÇÃO: você pode não ser respondido imediatamente!
            </p>
            <p className="text-white text-xs">
              Em caso de emergência, ligue{" "}
              <a
                href="tel:192"
                className="font-bold underline hover:opacity-80 transition-opacity"
              >
                192 (SAMU)
              </a>{" "}
              ou{" "}
              <a
                href="tel:188"
                className="font-bold underline hover:opacity-80 transition-opacity"
              >
                188 (CVV)
              </a>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold text-[16px] font-inter text-typography">
            Quais profissionais você deseja enviar pedido de ajuda?
          </h3>
          <div className="flex flex-col gap-4">
            {providers &&
              providers.map((provider: ProviderRetrieve) => (
                <RadioCheckbox
                  key={provider.provider_id}
                  id={`provider-${provider.provider_id}`}
                  label={
                    provider.social_name ||
                    provider.first_name + " " + provider.last_name ||
                    "Profissional sem nome"
                  }
                  checked={selectedProviders.includes(provider.provider_id)}
                  onCheckedChange={() =>
                    handleProviderSelect(provider.provider_id)
                  }
                />
              ))}
          </div>
        </div>

        <div className="space-y-2">
          <TextField
            id="help-message"
            name="helpMessage"
            label="Mensagem (opcional)"
            placeholder="Descreva seu pedido de ajuda..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value.slice(0, 200))}
            type="text"
            maxLength={200}
          />
          <p className="text-xs text-gray2 ml-4">
            {freeText.length}/200 caracteres
          </p>
        </div>

        {/* Loading State */}
        {isSubmitting && (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
            <span className="text-typography text-sm">Enviando pedido...</span>
          </div>
        )}

        <div className="px-4 mt-auto pb-4">
          <Button
            variant="orange"
            size="responsive"
            type="submit"
            disabled={isSubmitting || selectedProviders.length === 0}
          >
            {isSubmitting ? "Enviando..." : "ENVIAR PEDIDO DE AJUDA"}
          </Button>
        </div>
      </form>
    <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
    </div>
  );
}
