import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import type { ProviderPersonSummary } from "@/api/models/ProviderPersonSummary";

// Função auxiliar para converter data DD/MM/AAAA ou ISO para objeto Date
const parseDate = (dateStr: string | undefined | null): Date => {
    if (!dateStr || dateStr === "" || dateStr === "-") {
        return new Date(0); // Retorna epoch para datas vazias, nulas ou "-"
    }

    // Tenta parsear como DD/MM/YYYY
    if (dateStr.includes("/")) {
        const parts = dateStr.split("/");
        if (parts.length === 3) {
            const dayStr = parts[0];
            const monthStr = parts[1];
            const yearStr = parts[2];

            if (dayStr && monthStr && yearStr) {
                const day = Number.parseInt(dayStr, 10);
                const month = Number.parseInt(monthStr, 10) - 1; // Mês é 0-indexado em Date
                const year = Number.parseInt(yearStr, 10);

                if (!Number.isNaN(day) && !Number.isNaN(month) && !Number.isNaN(year)) {
                    const d = new Date(year, month, day);
                    // Confirma se a data construída é válida e corresponde às partes (evita roll-overs)
                    if (
                        d.getFullYear() === year &&
                        d.getMonth() === month &&
                        d.getDate() === day
                    ) {
                        return d;
                    }
                }
            }
        }
    }

    // Fallback: Tenta parsear com o construtor Date diretamente (pode pegar formatos ISO)
    const d = new Date(dateStr);
    if (!Number.isNaN(d.getTime())) {
        return d;
    }

    return new Date(0); // Retorna epoch se nenhum formato for reconhecido ou data inválida
};


export default function AcsMainPage() {
  const navigate = useNavigate();
  const [emergencyCount, setEmergencyCount] = useState<number>(0);
  const [_loading, setLoading] = useState<boolean>(true);
  const [_error, setError] = useState<string | null>(null);

    // Busca a contagem de emergências ao carregar a página
    useEffect(() => {
        const fetchEmergencyCount = async () => {
            try {
                setLoading(true);
                const response = await ProviderService.providerEmergencyCountRetrieve();
                // Verifica se a resposta contém a propriedade emergency_count
                if (response && 'emergency_count' in response) {
                    setEmergencyCount(response.emergency_count);
                } else {
                    console.error('Formato de resposta inválido:', response);
                    setError('Não foi possível obter o número de emergências.');
                }
            } catch (err) {
                console.error('Erro ao buscar contagem de emergências:', err);
                setError('Erro ao carregar contagem de emergências.');
            } finally {
                setLoading(false);
            }
        };

    fetchEmergencyCount();
  }, []);

  // Funções de navegação - atualizadas para usar navigate em vez de router.push
  const handleEmergencyClick = () => {
    navigate("/emergencies");
  };

  const handleAppointmentClick = () => {
    navigate("/appointments/amanda");
  };

  const handleBannerIconClick = () => {
    navigate("/patient-registry");
  };

  const handleNavigationClick = (itemId: string) => {
    // Implementar navegação baseada no item clicado
    switch (itemId) {
      case "home":
        // Já estamos na home
        break;
      //case 'consults':
      //    navigate('/appointments');
      //    break;
      case "patients":
        navigate("/patients");
        break;
      case "emergency":
        navigate("/emergencies");
        break;
      //case 'profile':
      //    navigate('/profile');
      //    break;
    }
  };

  return (
    <div className="bg-gray-50 h-full pb-24" style={{ minHeight: "100vh" }}>
      {/* Banner superior */}
      <HomeBanner
        title="Registro diário"
        subtitle="Cheque registro dos seus pacientes"
        onIconClick={handleBannerIconClick}
      />

      {/* Container para os cards */}
      <div className="px-4 py-5 flex justify-center gap-4">
        {/* Card de Emergência */}
        <InfoCard
          variant="emergency"
          count={emergencyCount}
          onClick={handleEmergencyClick}
        />

        {/* Card de Próxima Consulta */}
        <InfoCard
          variant="appointment"
          title="Próxima consulta"
          name="Amanda de Souza"
          date="26/04/2024"
          time="13:00"
          onClick={handleAppointmentClick}
        />
      </div>

            {/* Barra de navegação */}
            <BottomNavigationBar
                variant="acs"
                initialActiveId="home"
                onItemClick={handleNavigationClick}
            />
        </div>
    );
}