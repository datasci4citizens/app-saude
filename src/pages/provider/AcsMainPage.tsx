import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { HelpService } from "@/api/services/HelpService";

export default function AcsMainPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [emergencyCount, setEmergencyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get active navigation item based on current route
  const getActiveNavId = () => {
    if (location.pathname.startsWith("/acs-main-page")) return "home";
    if (location.pathname.startsWith("/appointments")) return "consults";
    if (location.pathname.startsWith("/patients")) return "patients";
    if (location.pathname.startsWith("/emergencies")) return "emergency";
    if (location.pathname.startsWith("/acs-profile")) return "profile";
    return null;
  };

  // Busca a contagem de pedidos de ajuda ao carregar a página
  useEffect(() => {
    const fetchEmergencyCount = async () => {
      try {
        setLoading(true);
        const response = await HelpService.providerHelpCountRetrieve();
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

  // Funções de navegação
  const handleEmergencyClick = () => {
    navigate("/patients");
  };

  const handleAppointmentClick = () => {
    navigate("/appointments/amanda");
  };

  const handleBannerIconClick = () => {
    navigate("/patient-registry");
  };

  const handleNavigationClick = (itemId: string) => {
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

  return (
    <div className="bg-primary min-h-screen pb-24">
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
          loading={loading}
          error={error}
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
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <BottomNavigationBar
          variant="acs"
          forceActiveId={getActiveNavId()} // Controlled active state
          onItemClick={handleNavigationClick}
        />
      </div>
    </div>
  );
}