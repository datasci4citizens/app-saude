import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { HelpService } from "@/api/services/HelpService";
export default function AcsMainPage() {
  const navigate = useNavigate();
  const [emergencyCount, setEmergencyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Busca a contagem de pedidos de ajuda ao carregar a página
  useEffect(() => {
    const fetchEmergencyCount = async () => {
      try {
        setLoading(true);
        const response = await HelpService.providerHelpCountRetrieve();
        // A nova API retorna um array, então contamos o tamanho do array
        setEmergencyCount(response.help_count || 0);
      } catch (err) {
        console.error("Erro ao buscar contagem de pedidos de ajuda:", err);
        setError("Erro ao carregar contagem de pedidos de ajuda.");
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
      case "profile":
        navigate("/acs-profile");
        break;
    }
  };

  return (
    <div className="bg-primary h-full pb-24" style={{ minHeight: "100vh" }}>
      {/* Banner superior */}
      <HomeBanner
        title="Registro diário"
        subtitle="Cheque registro dos seus pacientes"
        onIconClick={handleBannerIconClick}
      />

      {/* Container para os cards */}
      <div className="px-4 py-5 flex justify-center gap-4">
        {/* Card de Pedido de Ajuda */}
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
