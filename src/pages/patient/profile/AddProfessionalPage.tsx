import { useState } from "react";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import { LinkPersonProviderService } from '@/api/services/LinkPersonProviderService';
import type { PersonLinkProviderRequest } from '@/api/models/PersonLinkProviderRequest';

const AddProfessionalPage = () => {
  const [providerCode, setProviderCode] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linkSuccess, setLinkSuccess] = useState(false);

 


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
      subtitle="Peça para o profissional de saúde ou ACS te fornecer o código"
    />

    <div className="mt-6">
      <TextField
        id="providerCode"
        name="providerCode"
        label="Inserir código do profissional"
        value={providerCode}
        onChange={(e) => setProviderCode(e.target.value)}
        placeholder="Código de 6 dígitos"
        error={linkError || undefined}
      />
    </div>
    
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
    
    <div className="fixed bottom-[44px] left-0 right-0 px-6">
      <Button
        className="w-full"
        variant="white"
        onClick={handleAddProvider}
        disabled={isLinking || linkSuccess || providerCode.length !== 6 }
      >
        {isLinking ? "Vinculando..." : "Adicionar profissional"}
      </Button>
    </div>
  </div>
);
};

export default AddProfessionalPage;
