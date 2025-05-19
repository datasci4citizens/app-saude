import { useState } from "react";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import type { PersonLinkProviderRequest } from "@/api/models/PersonLinkProviderRequest";
import type { ProviderRetrieve } from "@/api/models/ProviderRetrieve";

import errorImage from "@/lib/images/error.png"; // ajuste o caminho conforme necessário

const AddProfessionalPage = () => {
  const [providerCode, setProviderCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [provider, setProvider] = useState<ProviderRetrieve | null>(null);
  const [showVisualError, setShowVisualError] = useState(false);

  // Fetch provider details by code
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

  // Function to handle linking with provider
  const handleAddProvider = async () => {
    if (!providerCode || providerCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      setShowVisualError(true);
      return;
    }

    setIsLinking(true);

    try {
      const linkRequest: PersonLinkProviderRequest = {
        code: providerCode,
      };

      const response =
        await LinkPersonProviderService.personLinkCodeCreate(linkRequest);

      setLinkSuccess(true);
      alert("Profissional vinculado com sucesso!");
      console.log("Successfully linked with provider:", response);
    } catch (error) {
      console.error("Error linking with provider:", error);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <div className="p-[24px] pb-28 bg-white min-h-screen font-inter relative">
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
              alt="Landing illustration"
              className="w-64 h-64 mb-4"
            />
            <div className="text-[#141B36]">{error}</div>
          </div>
        )}

        {!provider && !linkSuccess && (
          <Button
            onClick={fetchProviderByCode}
            variant="white"
            className="w-[calc(100%-44px)] mt-4 fixed bottom-[48px] mx-[24px] px-6 left-0"
            disabled={isLoading || providerCode.length !== 6}
          >
            {isLoading ? "Buscando..." : "Buscar profissional"}
          </Button>
        )}
      </div>

      {provider && !linkSuccess && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-xl flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full overflow-hidden flex items-center justify-center">
              <div className="text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-12 h-12"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                    clipRule="evenodd"
                  />
                </svg>
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
            Certifique-se que este é o profissional correto antes de confirmar.
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

      <div className="fixed bottom-[44px] left-0 right-0 px-6">
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
        ) : null}
      </div>
    </div>
  );
};

export default AddProfessionalPage;
