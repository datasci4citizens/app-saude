import { useState, useEffect } from "react";
import { TextField } from "@/components/forms/text_input";
import PatientButton from "@/components/ui/patient-button";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { ProviderService } from "@/api/services/ProviderService";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

// Interface para os dados dos pacientes em emergência conforme API
interface EmergencyPatient {
  id: number | string;
  name: string;
  age: number;
  last_visit_date: string;
  last_emergency_date: string;
}

// Interface para o formato utilizado na UI
interface FormattedEmergencyPatient {
  id: number | string;
  name: string;
  age: number;
  lastVisit: string;
  lastEmergency: string;
}

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [error, setError] = useState<string | null>(null);

  // Usando SWR para buscar os dados dos pacientes em emergência
  const {
    data: emergencyPatients,
    error: fetchError,
    isLoading,
  } = useSWR(
    "emergencyPatients",
    async () => {
      try {
        // Buscando dados dos pacientes vinculados ao provider
        const patientData = await ProviderService.providerPersonsRetrieve();

        // Convertendo e formatando os dados da API para o formato esperado pelo componente
        const formattedPatients: FormattedEmergencyPatient[] = patientData
          // Filtrando apenas pacientes com emergências registradas
          .filter((patient: EmergencyPatient) => patient.last_emergency_date)
          .map((patient: EmergencyPatient) => ({
            id: patient.id,
            name: patient.name,
            age: patient.age || 0,
            lastVisit: patient.last_visit_date || "-",
            lastEmergency: patient.last_emergency_date || "-",
          }))
          // Filtrando para selecionar cards onde:
          // 1. last_visit_date é null OU
          // 2. lastVisit > lastEmergency
          .filter((patient: FormattedEmergencyPatient) => {
            // Se o paciente não tem last_visit_date na API original (null)
            if (patient.lastVisit === "-") {
              return true;
            }

            // Ou pacientes cuja última visita foi após a emergência
            const visitDate = parseDate(patient.lastVisit);
            const emergencyDate = parseDate(patient.lastEmergency);
            return visitDate > emergencyDate;
          });

        return formattedPatients;
      } catch (err) {
        console.error("Erro ao buscar pacientes em necessidade de ajuda:", err);
        setError(
          "Não foi possível carregar a lista de pacientes em necessidade de ajuda.",
        );
        return [];
      }
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // Cache por 1 minuto
    },
  );

  // Função auxiliar para converter data DD/MM/AAAA para objeto Date
  const parseDate = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return new Date(0); // Data mínima para valores vazios

    // Verifica se a data está no formato ISO ou DD/MM/YYYY
    if (dateStr.includes("-") && !dateStr.includes("/")) {
      // Formato ISO (YYYY-MM-DD)
      return new Date(dateStr);
    } else {
      // Formato DD/MM/YYYY
      const parts = dateStr.split("/").map(Number);
      const day = parts[0] || 0;
      const month = parts[1] || 0;
      const year = parts[2] || 0;
      return new Date(year, month - 1, day);
    }
  };

  // Filtra pacientes com base na busca
  const filteredBySearch = emergencyPatients
    ? emergencyPatients.filter((patient) =>
      patient.name.toLowerCase().includes(searchValue.toLowerCase()),
    )
    : [];

  // Aplica ordenação por data se estiver na aba urgentes
  const filteredPatients =
    activeTab === "Requerem ajuda"
      ? [...filteredBySearch].sort((a, b) => {
        // Ordena por data menos recente (mais antigas primeiro)
        return (
          parseDate(a.lastEmergency).getTime() -
          parseDate(b.lastEmergency).getTime()
        );
      })
      : filteredBySearch;

  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case "home":
        navigate("/acs-main-page");
        break;
      case "patients":
        navigate("/patients");
        break;
      case "emergency":
        break;
      case "profile":
        navigate("/acs-profile");
        break;
    }
  };

  // Função para lidar com o clique no paciente e navegar para a página individual
  const handlePatientClick = (patient: FormattedEmergencyPatient) => {
    navigate(`/patient/${patient.id}/emergency`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      {/* Header with back button and title */}
      <header className="p-4">
        {/* Back button at the top */}
        <div className="mb-2">
          <button onClick={() => navigate(-1)}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Title centered below */}
        <div className="flex justify-center text-typography">
          <h1
            className="font-bold"
            style={{ fontFamily: "'Work Sans', sans-serif", fontSize: "34px" }}
          >
            Pedidos de ajuda
          </h1>
        </div>
      </header>

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
          className={`py-2 px-4 ${activeTab === "Requerem ajuda" ? "border-b-2 border-selection text-selection font-medium" : ""}`}
          onClick={() => setActiveTab("Requerem ajuda")}
        >
          Requerem ajuda
        </button>
      </div>

      {/* Emergency patients list - usando a lista filtrada */}
      <div className="flex-1 px-4 overflow-auto">
        {isLoading ? (
          <div className="text-center p-4 text-gray2">
            Carregando pacientes...
          </div>
        ) : fetchError ? (
          <div className="text-center p-4 text-selection">{error}</div>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <PatientButton
              key={index}
              variant="emergency"
              name={patient.name}
              age={patient.age || 0}
              lastVisit={patient.lastVisit}
              lastEmergency={patient.lastEmergency}
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
        initialActiveId="emergency"
        onItemClick={handleNavigation}
      />
    </div>
  );
}
