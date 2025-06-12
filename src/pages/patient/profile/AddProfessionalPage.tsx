import { useState } from "react";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import type { PersonLinkProviderRequest } from "@/api/models/PersonLinkProviderRequest";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";
import errorImage from "@/lib/images/error.png";
import { AccountService } from "@/api";
import { SuccessMessage } from "@/components/ui/success-message";
import { ErrorMessage } from "@/components/ui/error-message";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useNavigate } from "react-router-dom";

const AddProfessionalPage = () => {
  const navigate = useNavigate(); // ← This is missing!

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
  const [providerCode, setProviderCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [provider, setProvider] = useState<ProviderRetrieve | null>(null);
  const [showVisualError, setShowVisualError] = useState(false);

  const fetchProviderByCode = async () => {
    if (!providerCode || providerCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      setShowVisualError(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setLinkError(null);
    setShowVisualError(false);
    setProvider(null);

    try {
      const request: PersonLinkProviderRequest = { code: providerCode };
      const providerData =
        await LinkPersonProviderService.providerByLinkCodeCreate(request);
      const fullname = `${providerData.first_name} ${providerData.last_name}`;
      providerData.social_name = providerData.social_name || fullname;
      setProvider(providerData);
    } catch (err) {
      console.error("Error fetching provider:", err);
      setError(
        "Não foi possível vincular ao profissional. Verifique o código e tente novamente.",
      );
      setShowVisualError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProvider = async () => {
    if (!providerCode || providerCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      setShowVisualError(true);
      return;
    }

    setIsLinking(true);
    setLinkError(null);

    try {
      const linkRequest: PersonLinkProviderRequest = { code: providerCode };
      const response =
        await LinkPersonProviderService.personLinkCodeCreate(linkRequest);

      setLinkSuccess(true);
      console.log("Successfully linked with provider:", response);
    } catch (error) {
      console.error("Error linking with provider:", error);
      setLinkError("Erro ao vincular profissional. Tente novamente.");
    } finally {
      setIsLinking(false);
    }
  };

  const clearError = () => {
    setError(null);
    setShowVisualError(false);
  };

  const clearLinkError = () => {
    setLinkError(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary font-inter">
      {/* Top content */}
      <div className="px-[24px] pt-[24px]">
        <Header
          title="Adicionar profissional"
          subtitle="Peça para o profissional de saúde ou ACS te fornecer o ID dele"
        />

        {/* Success message */}
        {linkSuccess && (
          <SuccessMessage message="Profissional vinculado com sucesso! Você agora tem acesso aos serviços deste profissional." />
        )}

        {/* Link error message */}
        {linkError && (
          <ErrorMessage
            message={linkError}
            onClose={clearLinkError}
            onRetry={clearLinkError}
            variant="destructive"
          />
        )}

        <div className="mt-6">
          <TextField
            id="providerCode"
            name="providerCode"
            label="Inserir código do profissional"
            value={providerCode}
            onChange={(e) => setProviderCode(e.target.value)}
            placeholder="Código de 6 dígitos"
            error={error && !showVisualError ? error : undefined}
          />

          {showVisualError && !provider && !linkSuccess && (
            <div className="text-center flex flex-col items-center mt-6">
              <img
                src={errorImage}
                alt="Erro ao buscar"
                className="w-64 h-64 mb-4"
              />
              <ErrorMessage
                message={error || "Erro desconhecido"}
                onClose={clearError}
                onRetry={clearError}
                variant="destructive"
                className="mt-4"
              />
            </div>
          )}
        </div>

        {provider && !linkSuccess && (
          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img
                    src={provider.profile_picture || "/default-profile.png"}
                    alt={provider.social_name || "Profissional de Saúde"}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 text-lg">
                  {provider.social_name}
                </h3>
                <p className="text-gray-500 text-sm">
                  {provider.professional_registration}
                </p>
              </div>
            </div>
            <p className="mt-4 text-gray-500 text-sm text-center">
              Certifique-se que este é o profissional correto antes de
              confirmar.
            </p>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="mt-auto mb-[44px] px-6">
        {provider && !linkSuccess ? (
          <div className="flex gap-3">
            <Button
              onClick={() => setProvider(null)}
              variant="primary"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAddProvider}
              variant="white"
              className="flex-1"
              disabled={isLinking}
            >
              {isLinking ? "Vinculando..." : "Confirmar vínculo"}
            </Button>
          </div>
        ) : linkSuccess ? (
          <Button
            onClick={() => window.history.back()}
            variant="white"
            className="w-full"
          >
            Voltar ao perfil
          </Button>
        ) : (
          <Button
            onClick={fetchProviderByCode}
            variant="white"
            className="w-full mt-4"
            disabled={isLoading || providerCode.length !== 6}
          >
            {isLinking ? "Buscando..." : "Buscar profissional"}
          </Button>
        )}
      </div>
      <BottomNavigationBar
        variant="user"
        forceActiveId={getActiveNavId()} // Controlled active state
        onItemClick={handleNavigationClick}
      />
    </div>
  );
};

export default AddProfessionalPage;
