import { useState } from "react";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { LinkPersonProviderService } from '@/api/services/LinkPersonProviderService';
import type { PersonLinkProviderRequest } from '@/api/models/PersonLinkProviderRequest';
import type { ProviderRetrieve } from '@/api/models/ProviderRetrieve';

const AddProfessionalPage = () => {
  const [providerCode, setProviderCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);
  const [provider, setProvider] = useState<ProviderRetrieve | null>(null);

  // Fetch provider details by code
  const fetchProviderByCode = async () => {
    if (!providerCode || providerCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setProvider(null);
    
    try {
      const request: PersonLinkProviderRequest = { code: providerCode };
      const providerData = await LinkPersonProviderService.providerByLinkCodeCreate(request);
      setProvider(providerData);
    } catch (err) {
      console.error('Error fetching provider:', err);
      setError('Código inválido ou expirado. Verifique e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle linking with provider
  const handleAddProvider = async () => {
    if (!providerCode || providerCode.length !== 6){
      setLinkError("O código deve ter 6 dígitos");
      return;
    }

    setIsLinking(true);
    setLinkError(null);

    try {
      // Create the request payload
      const linkRequest: PersonLinkProviderRequest = {
        code: providerCode
      };

      // Call the API to link patient with provider
      const response = await LinkPersonProviderService.personLinkCodeCreate(linkRequest);

      // Handle success
      setLinkSuccess(true);

      // show success message
      // not in console though
      alert("Profissional vinculado com sucesso!");
      console.log('Successfully linked with provider:', response);
    } catch (error) {
      // Handle errors
      console.error('Error linking with provider:', error);
      setLinkError('Não foi possível vincular ao profissional. Verifique o código e tente novamente.');
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
          error={error || undefined}
        />
        
        {!provider && !linkSuccess && (
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
      
      {/* Provider details */}
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
              <p className="text-gray-500 text-sm">{provider.professional_registration}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-500 text-sm text-center">
            Certifique-se que este é o profissional correto antes de confirmar.
          </p>
        </div>
      )}
      
      {/* Success message */}
      {linkSuccess && (
        <div className="mt-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-lg flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-medium">Profissional vinculado com sucesso!</p>
            <p className="text-sm">Você agora tem acesso aos serviços deste profissional.</p>
          </div>
        </div>
      )}
      
      {/* Link or back buttons */}
      <div className="fixed bottom-[44px] left-0 right-0 px-6">
        {provider && !linkSuccess ? (
          <div className="flex gap-3">
            <Button
              onClick={() => setProvider(null)}
              variant="orange"
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
