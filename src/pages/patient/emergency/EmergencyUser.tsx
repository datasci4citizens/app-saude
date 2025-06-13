import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Button } from "@/components/forms/button";
import { TextField } from "@/components/forms/text_input";
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
    dedupingInterval: 60000,
  });

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.person_id) {
      setError("ID do usuário não encontrado. Tente recarregar a página.");
      return;
    }

    if (selectedProviders.length === 0) {
      setError("Selecione pelo menos um profissional para enviar o pedido de ajuda.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const emergencyRequests: ObservationCreate[] = selectedProviders.map(
        (providerId) => ({
          person: user.person_id,
          provider: providerId,
          value_as_string: freeText || "Pedido de Ajuda",
          observation_date: new Date().toISOString(),
          shared_with_provider: true,
        }),
      );

      await HelpService.helpSendCreate(emergencyRequests);

      const providerCount = selectedProviders.length;
      const providerText = providerCount === 1 ? "profissional" : "profissionais";
      setSuccess(`Pedido de ajuda enviado com sucesso para ${providerCount} ${providerText}!`);

      setSelectedProviders([]);
      setFreeText("");

      setTimeout(() => {
        navigate("/user-main-page");
      }, 2000);
    } catch (error: any) {
      console.error("Erro ao enviar pedido de ajuda:", error);

      if (error?.response?.status === 400) {
        setError("Dados inválidos. Verifique as informações e tente novamente.");
      } else if (error?.response?.status === 404) {
        setError("Profissional não encontrado. Tente atualizar a página.");
      } else if (error?.response?.status >= 500) {
        setError("Erro no servidor. Tente novamente em alguns minutos.");
      } else if (error?.message) {
        setError(`Erro ao enviar pedido de ajuda: ${error.message}`);
      } else {
        setError("Erro ao enviar pedido de ajuda. Verifique sua conexão e tente novamente.");
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

  // Loading state
  if (isUserLoading || isProvidersLoading) {
    return (
      <div className="flex flex-col h-screen bg-homebg">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray2/20 border-t-selection"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg">⚕️</span>
              </div>
            </div>
            <div>
              <p className="text-typography font-medium">Carregando profissionais...</p>
              <p className="text-gray2 text-sm mt-1">Aguarde um momento</p>
            </div>
          </div>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  // Error state
  if (providersError) {
    return (
      <div className="flex flex-col h-screen bg-homebg">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-typography font-semibold text-lg mb-2">
              Erro ao carregar
            </h3>
            <p className="text-gray2 text-sm mb-4">
              Não foi possível carregar seus profissionais vinculados.
            </p>
          </div>
          <div className="space-y-3 w-full max-w-sm">
            <Button
              variant="orange"
              className="w-full"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/user-main-page")}
            >
              Voltar ao início
            </Button>
          </div>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  // No providers state
  if (providers && providers.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-homebg">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-accent1/20 rounded-full flex items-center justify-center mb-6 mx-auto">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <h3 className="text-typography font-semibold text-xl mb-3">
              Nenhum profissional vinculado
            </h3>
            <p className="text-gray2 text-sm leading-relaxed max-w-sm">
              Para enviar pedidos de ajuda, você precisa primeiro adicionar um profissional 
              de saúde ao seu perfil.
            </p>
          </div>
          <div className="space-y-3 w-full max-w-sm">
            <Button
              variant="orange"
              className="w-full"
              onClick={() => navigate("/add-professional")}
            >
              Adicionar profissional
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/user-main-page")}
            >
              Voltar ao início
            </Button>
          </div>
        </div>
        <BottomNavigationBar
          variant="user"
          forceActiveId={getActiveNavId()}
          onItemClick={handleNavigationClick}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-homebg">
      <Header title="Pedido de Ajuda" />
      
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 py-6 space-y-6">
          {/* Success Message */}
          {success && (
            <SuccessMessage 
              message={success} 
              onClose={clearSuccess}
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onClose={clearError}
              onRetry={clearError}
              variant="destructive"
              className="animate-in slide-in-from-top-2 duration-300"
            />
          )}

          {/* Emergency Disclaimer */}
          <div className="bg-gradient-to-r from-destructive/15 to-destructive/10 border border-destructive/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-destructive text-lg font-bold">⚠️</span>
              </div>
              <div className="flex-1">
                <h4 className="text-destructive font-semibold text-sm mb-2">
                  ATENÇÃO: Resposta não imediata
                </h4>
                <p className="text-destructive/80 text-xs leading-relaxed mb-3">
                  Este não é um serviço de emergência. Em situações urgentes, 
                  contate os serviços oficiais:
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="tel:192"
                    className="inline-flex items-center gap-1 bg-destructive text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-destructive/90 transition-colors"
                  >
                    📞 192 (SAMU)
                  </a>
                  <a
                    href="tel:188"
                    className="inline-flex items-center gap-1 bg-destructive text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-destructive/90 transition-colors"
                  >
                    💬 188 (CVV)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Providers Selection */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <h3 className="text-typography font-semibold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-selection/20 rounded-full flex items-center justify-center">
                  <span className="text-selection text-sm">👨‍⚕️</span>
                </span>
                Selecionar profissionais
              </h3>
              <p className="text-gray2 text-sm mb-4">
                Escolha quais profissionais devem receber seu pedido de ajuda:
              </p>
              
              <div className="space-y-3">
                {providers?.map((provider: ProviderRetrieve) => (
                  <div 
                    key={provider.provider_id}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200
                      ${selectedProviders.includes(provider.provider_id)
                        ? 'border-selection bg-selection/5 shadow-sm'
                        : 'border-gray2/20 hover:border-gray2/40 hover:bg-gray2/5'
                      }
                    `}
                  >
                    <RadioCheckbox
                      id={`provider-${provider.provider_id}`}
                      label={
                        provider.social_name ||
                        `${provider.first_name} ${provider.last_name}` ||
                        "Profissional sem nome"
                      }
                      checked={selectedProviders.includes(provider.provider_id)}
                      onCheckedChange={() => handleProviderSelect(provider.provider_id)}
                    />
                  </div>
                ))}
              </div>
              
              {selectedProviders.length > 0 && (
                <div className="mt-4 p-3 bg-selection/10 rounded-lg">
                  <p className="text-selection text-sm font-medium">
                    ✓ {selectedProviders.length} profissional(is) selecionado(s)
                  </p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="bg-card rounded-2xl p-5 border border-card-border">
              <h3 className="text-typography font-semibold text-base mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-accent1/20 rounded-full flex items-center justify-center">
                  <span className="text-accent1 text-sm">💬</span>
                </span>
                Mensagem (opcional)
              </h3>
              
              <TextField
                id="help-message"
                name="helpMessage"
                placeholder="Descreva brevemente sua situação ou como podem te ajudar..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value.slice(0, 200))}
                type="text"
                maxLength={200}
                className="mb-2"
              />
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray2">
                  {freeText.length}/200 caracteres
                </span>
                {freeText.length > 150 && (
                  <span className="text-yellow-600">
                    {200 - freeText.length} restantes
                  </span>
                )}
              </div>
            </div>

            {/* Submit Loading State */}
            {isSubmitting && (
              <div className="bg-card rounded-2xl p-5 border border-card-border">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-selection/20 border-t-selection"></div>
                  <span className="text-typography text-sm font-medium">
                    Enviando seu pedido de ajuda...
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button - Now inside form for better UX */}
            <div className="pt-4">
              <Button
                variant="orange"
                size="full"
                type="submit"
                disabled={isSubmitting || selectedProviders.length === 0}
                className="h-14 text-base font-semibold shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                    <span>Enviando pedido...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚨</span>
                    <span>ENVIAR PEDIDO DE AJUDA</span>
                    {selectedProviders.length > 0 && (
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {selectedProviders.length}
                      </span>
                    )}
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="bg-background border-t border-card-border p-4 pb-6">
        <Button
          variant="orange"
          size="full"
          type="submit"
          disabled={isSubmitting || selectedProviders.length === 0}
          onClick={handleSubmit}
          className="h-12 text-base font-semibold"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
              Enviando...
            </div>
          ) : (
            <>
              <span className="mr-2">🚨</span>
              ENVIAR PEDIDO DE AJUDA
            </>
          )}
        </Button>
      </div>

      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}