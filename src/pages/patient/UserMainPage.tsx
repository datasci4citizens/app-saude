import { useNavigate } from "react-router-dom";
import HomeBanner from "@/components/ui/home-banner";
import InfoCard from "@/components/ui/info-card";
import BottomNavigationBar from "@/components/ui/navigator-bar";

export default function AcsMainPage() {
    const navigate = useNavigate();

    // Funções de navegação - atualizadas para usar navigate em vez de router.push
    const handleEmergencyClick = () => {
        navigate('/emergencie');
    };

    const handleAppointmentClick = () => {
        navigate('/appointments/amanda');
    };

    const handleBannerIconClick = () => {
        navigate('/diary');
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
                navigate('/emergencie');
                break;
            case 'profile':
                navigate('/profile');
                break;
            case 'diary':
                navigate('/diary');
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
            <div className="px-4 py-5 flex justify-center gap-4">
                {/* Card de Emergência */}
                <InfoCard
                    variant="consultations"
                    title="Remédios"
                    consultations={
                        [
                            { doctor: 'LEXAPRO', time: '10:00' },
                            { doctor: 'RIVOTRIL', time: '12:00' },
                        ]
                    }
                    onClick={handleAppointmentClick}
                />

                {/* Card de Próxima Consulta */}
                <InfoCard
                    variant="consultations"
                    title="Consultas"
                    consultations={[
                        { doctor: 'DR JOSÉ', time: '10:00' },
                        { doctor: 'DRA TULLA', time: '12:00' },
                    ]}
                    onClick={handleAppointmentClick}
                />
            </div>

            {/* Barra de navegação */}
            <BottomNavigationBar
                variant="user"
                initialActiveId="home"
                onItemClick={handleNavigationClick}
            />
        </div>
    );
}
