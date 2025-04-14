import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { PersonService } from "@/api/services/PersonService";
import { HelpService } from "@/api/services/HelpService"; // Import HelpService
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";
import type { ObservationRetrieve } from "@/api/models/ObservationRetrieve";
import ViewButton from "@/components/ui/ViewButton"; // Import ViewButton
import { ProviderService } from "@/api";

// Define a basic interface for Diary Entries based on actual API response
interface DiaryEntry {
  diary_id: number;
  date: string;
  scope: string;
  entries: any[]; // The actual diary entries array
}

// Define interface for Help Requests
interface HelpRequest {
  id: number;
  created_at: string;
  observation_date: string | null | undefined;
  value_as_string?: string | null | undefined;
  person?: number | null | undefined;
}

export default function ViewPatient() {
  const { id, context } = useParams<{ id: string; context?: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [diariesLoading, setDiariesLoading] = useState(true);
  const [diariesError, setDiariesError] = useState<string | null>(null);

  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [helpRequestsLoading, setHelpRequestsLoading] = useState(true);
  const [helpRequestsError, setHelpRequestsError] = useState<string | null>(
    null,
  );

  const [activeTab, setActiveTab] = useState("diarios");

  useEffect(() => {
    if (!id) return;

    const fetchPatientData = async () => {
      try {
        setLoading(true);
        const patientData = await PersonService.apiPersonRetrieve(Number(id));
        setPatient(patientData);
        setError(null);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError("Não foi possível carregar os dados do paciente.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id]);

  useEffect(() => {
    if (!patient) return;

    const fetchDiaries = async () => {
      try {
        setDiariesLoading(true);
        const diariesData = await ProviderService.providerPatientsDiariesList(
          patient.person_id,
        );

        const sortedDiaries = (diariesData as DiaryEntry[]).sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });

        setDiaries(sortedDiaries);
        setDiariesError(null);
      } catch (err) {
        console.error("Error fetching diaries:", err);
        setDiariesError("Não foi possível carregar os diários do paciente.");
      } finally {
        setDiariesLoading(false);
      }
    };

    fetchDiaries();
  }, [patient]);

  useEffect(() => {
    if (!id) return;

    const fetchHelpRequests = async () => {
      try {
        setHelpRequestsLoading(true);
        // Buscar todos os pedidos de ajuda do provider
        const allHelpRequests = await HelpService.providerHelpList();

        // Filtrar apenas os pedidos de ajuda do paciente específico
        const patientHelpRequests = allHelpRequests.filter(
          (help: ObservationRetrieve) => help.person === Number(id),
        );

        // Mapear para o formato da interface HelpRequest
        const formattedHelpRequests: HelpRequest[] = patientHelpRequests.map(
          (help: ObservationRetrieve) => ({
            id: help.observation_id,
            created_at: help.created_at,
            observation_date: help.observation_date,
            value_as_string: help.value_as_string,
            person: help.person,
          }),
        );

        // Ordenar do mais recente para o mais antigo
        formattedHelpRequests.sort((a, b) => {
          const dateA = new Date(a.observation_date || a.created_at).getTime();
          const dateB = new Date(b.observation_date || b.created_at).getTime();
          return dateB - dateA;
        });

        setHelpRequests(formattedHelpRequests);
        setHelpRequestsError(null);
      } catch (err) {
        console.error("Error fetching help requests:", err);
        setHelpRequestsError(
          "Não foi possível carregar os pedidos de ajuda do paciente.",
        );
      } finally {
        setHelpRequestsLoading(false);
      }
    };
    fetchHelpRequests();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Dia ${date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })}`;
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      <div className="p-4">
        <Header title="Histórico do Paciente" centered={true} />
      </div>
      <div className="flex-1 px-4 overflow-auto m-4">
        {/* Informações do Paciente */}
        {loading && (
          <p className="text-campos-preenchimento2 text-gray2">Carregando...</p>
        )}
        {error && (
          <p className="text-campos-preenchimento2 text-destructive">{error}</p>
        )}
        {patient && !loading && !error && (
          <div className="space-y-3 mb-6 pb-4 border-b border-gray-200">
            <p className="text-campos-preenchimento2 text-typography">
              <span className="text-topicos2 text-typography-foreground">
                ID do Paciente:
              </span>{" "}
              {patient.person_id}
            </p>
            <p className="text-campos-preenchimento2 text-typography">
              <span className="text-topicos2 text-typography-foreground">
                Nome:
              </span>{" "}
              {patient.social_name || "Não informado"}
            </p>
            {context === "emergency" && (
              <p className="text-topicos text-destructive">
                Contexto: Emergência
              </p>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 ${
              activeTab === "diarios"
                ? "border-b-2 border-selection text-selection font-medium"
                : ""
            }`}
            onClick={() => setActiveTab("diarios")}
          >
            Diários
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === "ajuda"
                ? "border-b-2 border-selection text-selection font-medium"
                : ""
            }`}
            onClick={() => setActiveTab("ajuda")}
          >
            Pedidos de Ajuda
          </button>
        </div>

        {/* Conteúdo baseado na aba ativa */}
        {activeTab === "diarios" && (
          <>
            {diariesLoading && (
              <p className="text-campos-preenchimento2 text-gray2">
                Carregando diários...
              </p>
            )}
            {diariesError && (
              <p className="text-campos-preenchimento2 text-destructive">
                {diariesError}
              </p>
            )}
            {!diariesLoading && !diariesError && diaries.length === 0 && (
              <p className="text-campos-preenchimento2 text-gray2">
                Nenhum diário encontrado para este paciente.
              </p>
            )}
            {!diariesLoading && !diariesError && diaries.length > 0 && (
              <div className="space-y-4">
                {diaries.map((diary) => {
                  const entriesCount = diary.entries?.length || 0;
                  const entriesText =
                    entriesCount > 0
                      ? `${entriesCount} entrada${
                          entriesCount > 1 ? "s" : ""
                        } registrada${entriesCount > 1 ? "s" : ""}`
                      : "Nenhuma entrada registrada";

                  return (
                    <ViewButton
                      key={diary.diary_id}
                      dateText={formatDate(diary.date)}
                      mainText="Diário"
                      subText={entriesText}
                      onClick={() => {
                        navigate(
                          `/provider/patient/${id}/diary/${diary.diary_id}`,
                        );
                      }}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "ajuda" && (
          <>
            {helpRequestsLoading && (
              <p className="text-campos-preenchimento2 text-gray2">
                Carregando pedidos de ajuda...
              </p>
            )}
            {helpRequestsError && (
              <p className="text-campos-preenchimento2 text-destructive">
                {helpRequestsError}
              </p>
            )}
            {!helpRequestsLoading &&
              !helpRequestsError &&
              helpRequests.length === 0 && (
                <p className="text-campos-preenchimento2 text-gray2">
                  Nenhum pedido de ajuda encontrado para este paciente.
                </p>
              )}
            {!helpRequestsLoading &&
              !helpRequestsError &&
              helpRequests.length > 0 && (
                <div className="space-y-4">
                  {helpRequests.map((helpRequest) => (
                    <ViewButton
                      key={helpRequest.id}
                      dateText={formatDate(
                        helpRequest.observation_date || helpRequest.created_at,
                      )}
                      mainText="Pedido de Ajuda"
                      subText={
                        helpRequest.value_as_string ||
                        "Pedido de ajuda sem descrição"
                      }
                      onClick={() =>
                        navigate(`/provider/help/${id}/${helpRequest.id}`)
                      }
                    />
                  ))}
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
}
