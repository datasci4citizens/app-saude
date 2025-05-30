import { useState, useEffect } from "react";
import { TextField } from "@/components/forms/text_input";
import PatientButton from "@/components/ui/patient-button";
import { useNavigate } from "react-router-dom";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { Button } from "@/components/forms/button";
import Header from "@/components/ui/header";

import { ProviderService } from "@/api/services/ProviderService";

interface Patient {
  id: string | number;
  name: string;
  age: number;
  lastVisit?: string;
  lastEmergency?: string;
  urgent?: boolean;
  highlight?: boolean;
}

// Função para formatar a data para DD/MM/AAAA
const formatDisplayDate = (dateString: string | undefined | null): string => {
  if (!dateString) {
    return ""; // Retorna string vazia se não houver data
  }
  try {
    const date = new Date(dateString);
    // Verifica se a data é válida após o parsing
    if (isNaN(date.getTime())) {
      return ""; // Data inválida
    }
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Meses são 0-indexados
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return ""; // Retorna string vazia em caso de erro
  }
};

export default function PatientsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [linkCode, setLinkCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar pacientes da API ao montar o componente
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const apiPatients =
          await LinkPersonProviderService.providerPersonsList();

        // Converter os dados da API para o formato esperado pelo componente
        const formattedPatients: Patient[] = apiPatients.map(
          (patient: any) => ({
            id: patient.person_id,
            name: patient.name,
            age: patient.age || 0,
            lastVisit: formatDisplayDate(patient.last_visit_date), // Formata a data
            lastEmergency: formatDisplayDate(patient.last_emergency_date), // Formata a data
            // Definir a propriedade urgent com base na data do último pedido de ajuda
            urgent: patient.last_emergency_date
              ? (new Date().getTime() -
                  new Date(patient.last_emergency_date).getTime()) /
                  (1000 * 3600 * 24) <
                30
              : false,
          }),
        );

        setPatients(formattedPatients);
      } catch (err) {
        console.error("Erro ao buscar pacientes:", err);
        setError("Não foi possível carregar a lista de pacientes.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filtra pacientes com base na busca
  const filteredBySearch = patients.filter((patient) =>
    patient.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  // Aplica ordenação por urgência se estiver na aba urgentes
  const filteredPatients =
    activeTab === "urgentes" // Corrigido para "urgentes"
      ? filteredBySearch.filter((patient) => patient.urgent)
      : filteredBySearch;

  const navigate = useNavigate();

  const handleNavigation = (itemId: string) => {
    console.log(`Navigated to ${itemId}`);
    switch (itemId) {
      case "home":
        navigate("/acs-main-page");
        break;
      case "patients":
        navigate("/patients");
        break;
      case "emergency":
        navigate("/emergencies");
        break;
      case "profile":
        navigate("/acs-profile");
        break;
    }
  };

  // Função para lidar com o clique no paciente e navegar para a página individual
  const handlePatientClick = (patient: any) => {
    console.log(`Navegando para página do paciente: ${patient.name}`);
    navigate(`/provider/patient/${patient.id}`);
  };

  // Determina a variante do botão do paciente baseado nos atributos
  const getPatientVariant = (patient: any) => {
    if (patient.urgent) return "emergency";
    // Não usa highlighted porque não é uma variante suportada
    return "patient";
  };

  // Function to generate provider link code
  const generateLinkCode = async () => {
    setIsGeneratingCode(true);
    setCodeError(null);

    try {
      const response = await LinkPersonProviderService.providerLinkCodeCreate();
      setLinkCode(response.code);
    } catch (error) {
      console.error("Error generating link code:", error);
      setCodeError("Não foi possível gerar o código. Tente novamente.");
    } finally {
      setIsGeneratingCode(false);
    }
  };

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    if (linkCode) {
      navigator.clipboard.writeText(linkCode);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      {/* Header component */}
      <div className="p-4">
        <Header title="Painel de pacientes" />
      </div>

      {/* Link code generator */}
      <div className="px-4 mb-4">
        <div className="bg-primary p-4 rounded-lg shadow-sm border border-gray1">
          <h2 className="text-lg font-semibold mb-2 font-['Work Sans']">
            Conectar com paciente
          </h2>
          <p className="text-sm text-gray2 mb-3">
            Gere um código para compartilhar com um paciente que deseja se
            conectar com você.
          </p>

          {linkCode ? (
            <div className="mb-3">
              <div className="flex items-center">
                <div className="bg-selection bg-opacity-10 p-3 rounded-lg flex-1 mr-2">
                  <p className="text-center font-bold text-xl text-orange">
                    {linkCode}
                  </p>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="orange"
                  className="whitespace-nowrap"
                >
                  Copiar
                </Button>
              </div>
              <p className="text-xs text-gray2 mt-1">
                Este código expira em 10 minutos.
              </p>
            </div>
          ) : (
            <Button
              onClick={generateLinkCode}
              variant="orange"
              className="w-full"
              disabled={isGeneratingCode}
            >
              {isGeneratingCode ? "Gerando..." : "Gerar código de conexão"}
            </Button>
          )}

          {codeError && (
            <p className="text-destructive text-sm mt-1">{codeError}</p>
          )}

          {linkCode && (
            <Button
              onClick={() => setLinkCode(null)}
              variant="orange"
              className="w-full mt-2 text-gray2"
            >
              Gerar novo código
            </Button>
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="px-4 mb-4">
        <TextField
          id="search"
          name="search"
          label="Buscar"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar pacientes..."
        />
      </div>

      {/* Tabs */}
      <div className="px-4 flex border-b mb-4">
        <button
          className={`py-2 px-4 ${activeTab === "todos" ? "border-b-2 border-selection text-selection font-medium" : ""}`}
          onClick={() => setActiveTab("todos")}
        >
          Todos
        </button>
        <button
          className={`py-2 px-4 ${activeTab === "urgentes" ? "border-b-2 border-selection text-selection font-medium" : ""}`}
          onClick={() => setActiveTab("urgentes")}
        >
          Requerem ajuda
        </button>
      </div>

      {/* Patients list */}
      <div className="flex-1 px-4 overflow-auto">
        {loading ? (
          <div className="text-center p-4 text-gray2">
            Carregando pacientes...
          </div>
        ) : error ? (
          <div className="text-center p-4 text-destructive">{error}</div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <PatientButton
              key={index}
              variant={getPatientVariant(patient)}
              name={patient.name}
              age={patient.age || 0}
              lastEmergency={patient.lastEmergency || "Sem pedidos de ajuda"} // Mantém o fallback aqui caso a data formatada seja ""
              lastVisit={patient.lastVisit || "-"} // Mantém o fallback aqui
              onClick={() => handlePatientClick(patient)}
            />
          ))
        ) : (
          <div className="text-center p-4 text-gray2">
            Nenhum paciente encontrado com este nome.
          </div>
        )}
      </div>

      {/* Bottom navigation using BottomNavigationBar component */}
      <BottomNavigationBar
        variant="acs"
        initialActiveId="patients"
        onItemClick={handleNavigation}
      />
    </div>
  );
}
