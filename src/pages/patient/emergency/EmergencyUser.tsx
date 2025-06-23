import type { ObservationCreate } from "@/api/models/ObservationCreate";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";
import { ApiService } from "@/api/services/ApiService";
import { HelpService } from "@/api/services/HelpService";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { Button } from "@/components/forms/button";
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { TextField } from "@/components/forms/text_input";
import { ErrorMessage } from "@/components/ui/error-message";
import Header from "@/components/ui/header";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { SuccessMessage } from "@/components/ui/success-message";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

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
      setError(
        "Selecione pelo menos um profissional para enviar o pedido de ajuda.",
      );
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
      const providerText =
        providerCount === 1 ? "profissional" : "profissionais";
      setSuccess(
        `Pedido de ajuda enviado com sucesso para ${providerCount} ${providerText}!`,
      );

      setSelectedProviders([]);
      setFreeText("");

      setTimeout(() => {
        navigate("/user-main-page");
      }, 2000);
    } catch (error: unknown) {
      console.error("Erro ao enviar pedido de ajuda:", error);

      // Best effort to get a status code
      const status =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        typeof error.response.status === "number"
          ? error.response.status
          : null;

      // Best effort to get a message
      const message =
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : null;

      if (status === 400) {
        setError(
          "Dados inválidos. Verifique as informações e tente novamente.",
        );
      } else if (status === 404) {
        setError("Profissional não encontrado. Tente atualizar a página.");
      } else if (status && status >= 500) {
        setError("Erro no servidor. Tente novamente em alguns minutos.");
      } else if (message) {
        setError(`Erro ao enviar pedido de ajuda: ${message}`);
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

  // CORRIGIDO: Função memoizada para evitar loop infinito
  const handleProviderSelect = React.useCallback((providerId: number) => {
    setSelectedProviders((prev) => {
      if (prev.includes(providerId)) {
        return prev.filter((id) => id !== providerId);
      }
      return [...prev, providerId];
    });
  }, []);

  // Loading state
  if (isUserLoading || isProvidersLoading) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-selection" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg">⚕️</span>
              </div>
            </div>
            <div>
              <p className="text-typography font-medium">
                Carregando profissionais...
              </p>
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
      <div className="flex flex-col h-screen bg-background">
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

  // No providers state - MELHORADO
  if (providers && providers.length === 0) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <Header title="Pedido de Ajuda" />
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center mb-8 max-w-sm">
            {/* Ícone melhorado */}
            <div className="w-24 h-24 bg-gradient-to-br from-selection/20 to-accent1/20 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
              <span className="text-4xl">👨‍⚕️</span>
            </div>

            {/* Título com melhor hierarquia */}
            <h2 className="text-typography font-bold text-xl mb-3 leading-tight">
              Nenhum profissional vinculado
            </h2>

            {/* Descrição mais clara e legível */}
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Para enviar pedidos de ajuda, você precisa primeiro adicionar um
              profissional de saúde ao seu perfil.
            </p>

            {/* Botões com melhor espaçamento */}
            <div className="space-y-3 w-full">
              <Button
                variant="orange"
                size="full"
                className="h-12 font-semibold shadow-md"
                onClick={() => navigate("/manage-professionals")}
              >
                <span className="mr-2">➕</span>
                Adicionar profissional
              </Button>
              <Button
                variant="ghost"
                size="full"
                className="h-11"
                onClick={() => navigate("/user-main-page")}
              >
                Voltar ao início
              </Button>
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

  return (
    <div className="flex flex-col h-screen bg-background">
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

          {/* Emergency Disclaimer - CORES TAILWIND PADRÃO (RED NAO EH COR TAILWIND)*/}
          <div className="bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 dark:text-red-400 text-xl font-bold">
                  ⚠️
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-red-900 dark:text-red-100 font-bold text-base mb-3">
                  ATENÇÃO: Resposta não imediata
                </h4>
                <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed mb-4 font-medium">
                  Este não é um serviço de emergência. Em situações urgentes,
                  contate os serviços oficiais:
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="tel:192"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
                  >
                    📞 192 (SAMU)
                  </a>
                  <a
                    href="tel:188"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
                  >
                    💬 188 (CVV)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Providers Selection - MELHORADO E CORRIGIDO */}
            <div className="bg-card rounded-2xl p-6 border border-card-border shadow-sm">
              <h3 className="text-typography font-bold text-lg mb-2 flex items-center gap-3">
                <span className="w-8 h-8 bg-selection/15 rounded-full flex items-center justify-center">
                  <span className="text-selection text-base">👨‍⚕️</span>
                </span>
                Selecionar profissionais
              </h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                Escolha quais profissionais devem receber seu pedido de ajuda:
              </p>

              <div className="space-y-3">
                {providers?.map((provider: ProviderRetrieve) => (
                  <div
                    key={provider.provider_id}
                    className={`
                      p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-sm
                      ${
                        selectedProviders.includes(provider.provider_id)
                          ? "border-selection bg-selection/5 shadow-md"
                          : "border-border hover:border-selection/30 hover:bg-accent/50"
                      }
                    `}
                  >
                    {/* CORRIGIDO: Removido onClick duplicado e deixado apenas o onCheckedChange */}
                    <RadioCheckbox
                      id={`provider-${provider.provider_id}`}
                      label={
                        provider.social_name ||
                        `${provider.first_name} ${provider.last_name}` ||
                        "Profissional sem nome"
                      }
                      checked={selectedProviders.includes(provider.provider_id)}
                      onCheckedChange={() =>
                        handleProviderSelect(provider.provider_id)
                      }
                    />
                  </div>
                ))}
              </div>

              {selectedProviders.length > 0 && (
                <div className="mt-5 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50 rounded-xl">
                  <p className="text-green-800 dark:text-green-300 text-sm font-semibold flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">
                      ✓
                    </span>
                    {selectedProviders.length} profissional(is) selecionado(s)
                  </p>
                </div>
              )}
            </div>

            {/* Message Input - MELHORADO */}
            <div className="bg-card rounded-2xl p-6 border border-card-border shadow-sm">
              <h3 className="text-typography font-bold text-lg mb-2 flex items-center gap-3">
                <span className="w-8 h-8 bg-accent1/15 rounded-full flex items-center justify-center">
                  <span className="text-accent1 text-base">💬</span>
                </span>
                Mensagem (opcional)
              </h3>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                Descreva brevemente sua situação ou como podem te ajudar:
              </p>

              <TextField
                id="help-message"
                name="helpMessage"
                placeholder="Ex: Estou passando por um momento difícil e preciso conversar..."
                value={freeText}
                onChange={(e) => setFreeText(e.target.value.slice(0, 200))}
                type="text"
                maxLength={200}
                className="mb-3"
              />

              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {freeText.length}/200 caracteres
                </span>
                {freeText.length > 150 && (
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">
                    {200 - freeText.length} restantes
                  </span>
                )}
              </div>
            </div>

            {/* Submit Loading State */}
            {isSubmitting && (
              <div className="bg-card rounded-2xl p-6 border border-card-border shadow-sm">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-selection/20 border-t-selection" />
                  <span className="text-typography text-base font-medium">
                    Enviando seu pedido de ajuda...
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button - MELHORADO */}
            <div className="pt-2">
              <Button
                variant="orange"
                size="full"
                type="submit"
                disabled={isSubmitting || selectedProviders.length === 0}
                className="h-14 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
                    <span>Enviando pedido...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🚨</span>
                    <span>ENVIAR PEDIDO DE AJUDA</span>
                    {selectedProviders.length > 0 && (
                      <span className="bg-white/25 px-2.5 py-1 rounded-full text-sm font-bold">
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

      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
