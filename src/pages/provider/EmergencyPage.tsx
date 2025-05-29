import { useState, useEffect } from "react";
import { TextField } from "@/components/forms/text_input";
import PatientButton from "@/components/ui/patient-button";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { ProviderService } from "@/api/services/ProviderService";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import Header from "@/components/ui/header";

// Interface para os dados dos pacientes em pedido de ajuda conforme API
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

// Função para formatar a data para DD/MM/AAAA
const formatDisplayDate = (dateString: string | undefined | null): string => {
  if (!dateString || dateString === "-") { // Considera "-" como sem data também
    return ""; // Retorna string vazia se não houver data ou for "-"
  }
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      if (typeof dateString === 'string' && dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) { // Verifica se todas as partes existem
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado
          const year = parseInt(parts[2], 10);
          // Verifica se os números são válidos antes de criar a data
          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const manualDate = new Date(year, month, day);
            if (!isNaN(manualDate.getTime())) {
              return `${String(manualDate.getDate()).padStart(2, '0')}/${String(manualDate.getMonth() + 1).padStart(2, '0')}/${manualDate.getFullYear()}`;
            }
          }
        }
      }
      return ""; // Data inválida ou formato não reconhecido
    }
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses são 0-indexados
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return ""; // Retorna string vazia em caso de erro
  }
};

export default function EmergencyPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("todos");
  const [error, setError] = useState<string | null>(null);

  // Usando SWR para buscar os dados dos pacientes em pedidos de ajuda
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
          // Filtrando apenas pacientes com pedidos de ajuda registradas
          .filter((patient: EmergencyPatient) => patient.last_emergency_date)
          .map((patient: EmergencyPatient) => ({
            id: patient.id,
            name: patient.name,
            age: patient.age || 0,
            lastVisit: formatDisplayDate(patient.last_visit_date), // Formata a data
            lastEmergency: formatDisplayDate(patient.last_emergency_date), // Formata a data
          }));

        return formattedPatients;
      } catch (err) {
        console.error("Erro ao buscar pacientes em pedidos de ajuda:", err);
        setError(
          "Não foi possível carregar a lista de pacientes em pedidos de ajuda.",
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
  const parseDate = (dateStr: string): Date => {
    if (!dateStr || dateStr === "" || dateStr === "-") {
      return new Date(0); // Retorna epoch para datas vazias, nulas ou "-"
    }

    // Tenta parsear como DD/MM/YYYY
    if (dateStr.includes("/")) {
      const parts = dateStr.split('/');
      if (parts.length === 3) {
        const dayStr = parts[0];
        const monthStr = parts[1];
        const yearStr = parts[2];

        if (dayStr && monthStr && yearStr) {
          const day = parseInt(dayStr, 10);
          const month = parseInt(monthStr, 10) - 1; // Mês é 0-indexado em Date
          const year = parseInt(yearStr, 10);

          if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            const d = new Date(year, month, day);
            // Confirma se a data construída é válida e corresponde às partes (evita roll-overs)
            if (d.getFullYear() === year && d.getMonth() === month && d.getDate() === day) {
              return d;
            }
          }
        }
      }
    }

    // Fallback: Tenta parsear com o construtor Date diretamente (pode pegar formatos ISO)
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d;
    }

    return new Date(0); // Retorna epoch se nenhum formato for reconhecido ou data inválida
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
      ? [...filteredBySearch]
          .filter((patient: FormattedEmergencyPatient) => {
            // 1. Must have a valid emergency date.
            if (!patient.lastEmergency || patient.lastEmergency === "") {
              return false;
            }
            const emergencyDateObj = parseDate(patient.lastEmergency);
            // Ensure the parsed emergencyDate is a valid date (not Invalid Date and not epoch 0 from empty string).
            if (isNaN(emergencyDateObj.getTime()) || emergencyDateObj.getTime() === 0) {
                return false;
            }

            // 2. Check visit date.
            // If no visit date, or visit date is effectively empty/invalid, it's pending.
            if (!patient.lastVisit || patient.lastVisit === "") {
              return true;
            }
            const visitDateObj = parseDate(patient.lastVisit);
            if (isNaN(visitDateObj.getTime()) || visitDateObj.getTime() === 0) { // No valid visit, so emergency is pending
                return true;
            }
            
            // 3. Both dates are valid and non-empty. Compare them.
            // Emergency is pending if visit is on or before emergency.
            return visitDateObj.getTime() <= emergencyDateObj.getTime();
          })
          .sort((a, b) => {
            // Ordena por data menos recente (mais antigas primeiro)
            const timeA = parseDate(a.lastEmergency).getTime();
            const timeB = parseDate(b.lastEmergency).getTime();
            return timeA - timeB;
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
      case "emergencies":
        break;
      case "profile":
        navigate("/acs-profile");
        break;
    }
  };

  // Função para lidar com o clique no paciente e navegar para a página individual
  const handlePatientClick = (patient: FormattedEmergencyPatient) => {
    navigate(`/provider/patient/${patient.id}/emergency`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      {/* Header with back button and title */}
      <div className="p-4">
        <Header
          title="Pedidos de Ajuda"
          onBackClick={() => navigate(-1)}
          />
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
          className={`py-2 px-4 ${activeTab === "Requerem ajuda" ? "border-b-2 border-selection text-selection font-medium" : ""}`}
          onClick={() => setActiveTab("Requerem ajuda")}
        >
          Últimos Pedidos de Ajuda
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
              lastVisit={patient.lastVisit || "-"} // Mantém fallback se formatDisplayDate retornar ""
              lastEmergency={patient.lastEmergency || "Sem pedidos de ajuda"} // Mantém fallback
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
