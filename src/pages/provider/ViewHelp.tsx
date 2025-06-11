import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import { HelpService } from "@/api/services/HelpService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import type { ObservationRetrieve } from "@/api/models/ObservationRetrieve";
import BottomNavigationBar from "@/components/ui/navigator-bar";


export default function ViewHelp() {
  const { personId, helpId } = useParams<{
    personId: string;
    helpId: string;
  }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [helpRequest, setHelpRequest] = useState<ObservationRetrieve | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const handleNavigationClick = (itemId: string) => {
    // Implementar navegação baseada no item clicado
    switch (itemId) {
      case "home":
        navigate("/acs-main-page");
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

  useEffect(() => {
    const fetchData = async () => {
      if (!personId || !helpId) {
        setError("IDs do paciente ou pedido de ajuda não encontrados.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Buscar dados do paciente
        const patientData = await PersonService.apiPersonRetrieve(
          Number(personId),
        );
        setPatient(patientData);

        // Buscar todos os pedidos de ajuda do provider
        const allHelpRequests = await HelpService.providerHelpList();

        // Encontrar o pedido específico
        const specificHelpRequest = allHelpRequests.find(
          (help: ObservationRetrieve) =>
            help.observation_id === Number(helpId) &&
            help.person === Number(personId),
        );

        if (!specificHelpRequest) {
          setError("Pedido de ajuda não encontrado.");
          return;
        }

        setHelpRequest(specificHelpRequest);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Não foi possível carregar os dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personId, helpId]);

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Data inválida";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-primary">
        <div className="p-4">
          <Header title="Pedido de Ajuda" centered={true} />
        </div>
        <div className="flex-1 px-4 py-8 flex justify-center items-center">
          <p className="text-campos-preenchimento2 text-gray2">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-primary">
        <div className="p-4">
          <Header title="Pedido de Ajuda" centered={true} />
        </div>
        <div className="flex-1 px-4 py-8">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive font-medium">Erro</p>
            <p className="text-destructive/80">{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-selection hover:bg-selection/90 text-primary px-4 py-2 rounded-md"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      <div className="p-4">
        <Header title="Pedido de Ajuda" centered={true} />
      </div>

      <div className="flex-1 px-4 overflow-auto">
        {/* Informações do Paciente */}
        {patient && (
          <div className="bg-offwhite rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-topicos2 text-typography-foreground font-semibold mb-3">
              Informações do Paciente
            </h2>
            <div className="space-y-2">
              <p className="text-campos-preenchimento2 text-typography">
                <span className="font-medium">ID:</span> {patient.person_id}
              </p>
              <p className="text-campos-preenchimento2 text-typography">
                <span className="font-medium">Nome:</span>{" "}
                {patient.social_name ||
                  patient.first_name + " " + patient.last_name ||
                  "Não informado"}
              </p>
            </div>
          </div>
        )}

        {/* Detalhes do Pedido de Ajuda */}
        {helpRequest && (
          <div className="bg-offwhite rounded-lg p-4 mb-6 shadow-sm">
            <h2 className="text-topicos2 text-typography-foreground font-semibold mb-3">
              Detalhes do Pedido
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-campos-preenchimento2 text-typography font-medium mb-1">
                  Data da Criação:
                </p>
                <p className="text-campos-preenchimento2 text-gray2">
                  {formatDateTime(helpRequest.created_at)}
                </p>
              </div>

              <div>
                <p className="text-campos-preenchimento2 text-typography font-medium mb-2">
                  Mensagem do Paciente:
                </p>
                <div className="bg-gray1 border border-gray2-border rounded-lg p-4">
                  <p className="text-campos-preenchimento2 text-typography whitespace-pre-wrap">
                    {helpRequest.value_as_string ||
                      "Nenhuma mensagem foi fornecida com este pedido de ajuda."}
                  </p>
                </div>
              </div>

              {helpRequest.observation_source_value && (
                <div>
                  <p className="text-campos-preenchimento2 text-typography font-medium mb-1">
                    Fonte da Observação:
                  </p>
                  <p className="text-campos-preenchimento2 text-gray2">
                    {helpRequest.observation_source_value}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
          <BottomNavigationBar
        variant="acs"
        initialActiveId="home"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
