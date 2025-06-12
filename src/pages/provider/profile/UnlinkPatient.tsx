import { useEffect, useState } from "react";
import Header from "@/components/ui/header";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { ApiService } from "@/api/services/ApiService";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { useNavigate, useLocation } from "react-router-dom";

export default function UnlinkPatient() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [providerId, setProviderId] = useState<number | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const getActiveNavId = () => {
    if (location.pathname.startsWith("/acs-main-page")) return "home";
    if (location.pathname.startsWith("/appointments")) return "consults";
    if (location.pathname.startsWith("/patients")) return "patients";
    if (location.pathname.startsWith("/emergencies")) return "emergency";
    if (location.pathname.startsWith("/acs-profile")) return "profile";
    return null;
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

  useEffect(() => {
    const fetchProviderIdAndPatients = async () => {
      try {
        setLoading(true);
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setProviderId(userEntity.provider_id);

        const result = await LinkPersonProviderService.providerPersonsList();
        setPatients(result);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os pacientes vinculados.");
      } finally {
        setLoading(false);
      }
    };

    fetchProviderIdAndPatients();
  }, []);

  const handleUnlink = async (personId: number) => {
    if (!providerId) {
      alert("ID do profissional não encontrado.");
      return;
    }
    const confirmed = window.confirm("Você tem certeza que quer remover este paciente?");
    if (!confirmed) return;

    try {
      await LinkPersonProviderService.personProviderUnlinkCreate(personId, providerId);
      setPatients((prev) => prev.filter((p) => p.person_id !== personId));
      alert("Paciente desvinculado com sucesso.");
    } catch (err) {
      alert("Erro ao desvincular paciente.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary font-inter">
      {/* Top content */}
      <div className="px-[24px] pt-[24px]">
        <Header
          title="Desvincular paciente"
          subtitle="Escolha o paciente e toque sobre seu nome para se desvincular."
        />
      </div>
      <div className="flex-1 px-4 overflow-auto m-4">
        {loading && <p>Carregando...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && patients.length === 0 && (
          <p>Nenhum paciente vinculado encontrado.</p>
        )}
        {!loading && !error && patients.length > 0 && (
          <div className="space-y-4">
            {patients.map((patient) => (
              <div
                key={patient.person_id}
                className="bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray2 p-4 rounded-xl flex items-center space-x-4 cursor-pointer hover:bg-selection dark:hover:bg-[#2c313a] transition shadow-sm"
                onClick={() => handleUnlink(patient.person_id)}
                title="Clique para desvincular este paciente"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="w-full h-full flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-2xl font-bold text-gray-600 dark:text-gray-300">
                    {(patient.full_name || patient.name || "P").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Nome:{" "}
                    <span className="font-normal">
                      {patient.full_name || patient.name}
                    </span>
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">
                    Idade:{" "}
                    <span className="font-normal">
                      {patient.age ? patient.age : "-"}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNavigationBar
        variant="acs"
        forceActiveId={getActiveNavId()}
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}