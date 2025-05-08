import { useState } from "react";
import useSWR from "swr";
import Header from "@/components/ui/header";
import { TextField } from "@/components/forms/text_input";
import { Button } from "@/components/forms/button";
import errorImage from "@/lib/images/error.png";

const fetchProfessional = async (id: string) => {
  const res = await fetch(`/api/professionals/${id}`);
  if (!res.ok) {
    throw new Error("Profissional não encontrado");
  }
  return res.json();
};

const AddProfessionalPage = () => {
  const [professionalId, setProfessionalId] = useState("");

  const shouldFetch = professionalId.length === 6;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? professionalId : null,
    fetchProfessional
  );

  const isValidProfessional = !!data && !error;

  return (
    <div className="p-[24px] pb-28 bg-white min-h-screen font-inter relative">
      <Header
        title="Adicionar profissional"
        subtitle="Peça para o profissional de saúde ou ACS te fornecer o ID dele"
      />

      <div className="mt-6">
        <TextField
          id="professionalId"
          name="professionalId"
          label="Inserir ID do profissional"
          value={professionalId}
          onChange={(e) => setProfessionalId(e.target.value)}
          placeholder="ID do profissional"
        />
      </div>

      {shouldFetch && (
        <div className="professional-container mt-6">
          {isLoading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : error ? (
            <div className="text-center flex flex-col items-center">
              <img
                src={errorImage}
                alt="Landing illustration"
                className="w-64 h-64 mb-4"
              />
              <div className="text-[#141B36]">Profissional não encontrado.</div>
            </div>
          ) : (
            <>
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
                    {data.nome}
                  </h3>
                  <p className="text-gray-600">{data.profissao}</p>
                  <p className="text-gray-500 text-sm">{data.conselho}</p>
                </div>
              </div>
              <p className="mt-4 text-gray-400 text-sm text-center">
                Certifique-se que o nome e o código do conselho batem com o de
                seu profissional!
              </p>
            </>
          )}
        </div>
      )}
      <div className="fixed bottom-[44px] left-0 right-0 px-6">
        <Button
          className="w-full"
          variant="white"
          onClick={() => console.log("Profissional confirmado:", data)}
          disabled={!isValidProfessional}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default AddProfessionalPage;
