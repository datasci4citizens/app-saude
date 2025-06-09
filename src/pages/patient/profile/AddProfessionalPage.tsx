import { useState } from "react";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import type { PersonLinkProviderRequest } from "@/api/models/PersonLinkProviderRequest";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";
import errorImage from "@/lib/images/error.png";
import { AccountService } from "@/api";

const AddProfessionalPage = () => {
  const [providerCode, setProviderCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);
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

    try {
      const linkRequest: PersonLinkProviderRequest = { code: providerCode };
      const response =
        await LinkPersonProviderService.personLinkCodeCreate(linkRequest);

      setLinkSuccess(true);
      console.log("Successfully linked with provider:", response);
    } catch (error: any) {
      console.error("Erro ao vincular com provedor:", error);

      const response = error?.body;

      if (response?.error) {
        setError(`Erro ao vincular: ${response.error}`);
      } else if (response?.message) {
        setError(`Erro ao vincular: ${response.message}`);
      } else {
        setError("Erro inesperado ao vincular com provedor.");
      }
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary font-inter">
      {/* Top content */}
      <div className="px-[24px] pt-[24px]">
        <Header
          title="Adicionar profissional"
          subtitle="Peça para o profissional de saúde ou ACS te fornecer o ID dele"
        />

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
              <div className="text-[#141B36]">{error}</div>
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

        {linkSuccess && (
          <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center">
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <p className="font-medium">Profissional vinculado com sucesso!</p>
              <p className="text-sm">
                Você agora tem acesso aos serviços deste profissional.
              </p>
            </div>
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
            {isLoading ? "Buscando..." : "Buscar profissional"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddProfessionalPage;
