import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";

export default function AcsMainPage() {
    const navigate = useNavigate();

    // Funções de navegação - atualizadas para usar navigate em vez de router.push
    const handleEmergencyClick = () => {
        navigate('/emergencies');
    };

    const handleAppointmentClick = () => {
        navigate('/appointments/amanda');
    };

    const handleBannerIconClick = () => {
        navigate('/patient-registry');
    };

    const handleNavigationClick = (itemId: string) => {
        // Implementar navegação baseada no item clicado
        switch (itemId) {
            case 'home':
                // Já estamos na home
                break;
            case 'consults':
                navigate('/appointments');
                break;
            case 'patients':
                navigate('/patients');
                break;
            case 'emergency':
                navigate('/emergencies');
                break;
            case 'profile':
                navigate('/profile');
                break;
        }
    };

    return (
        <div className="bg-gray-50 h-full pb-24" style={{ minHeight: '100vh' }}>
            {/* Banner superior */}
            <HomeBanner
                title="Registro diário"
                subtitle="Cheque registro dos seus pacientes"
                onIconClick={handleBannerIconClick}
            />

            {/* Container para os cards */}
            <div className="px-4 py-5 flex justify-between">
                {/* Card de Emergência */}
                <InfoCard
                    variant="emergency"
                    count={3}
                    onClick={handleEmergencyClick}
                />

                {/* Card de Próxima Consulta */}
                <InfoCard
                    variant="appointment"
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
