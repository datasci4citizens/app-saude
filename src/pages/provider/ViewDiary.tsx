import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/ui/header";
import { ProviderService } from "@/api/services/ProviderService";
import { PersonService } from "@/api/services/PersonService";
import type { PersonRetrieve } from "@/api/models/PersonRetrieve";

// Interface para as entradas do diário
interface DiaryEntryDetail {
  id?: number;
  text_content?: string;
  created_at?: string;
  scope?: string;
}

// Interface para o diário completo
interface DiaryDetail {
  diary_id: number;
  date: string;
  scope: string;
  entries: DiaryEntryDetail[];
}

export default function ViewDiary() {
  const { diaryId, personId } = useParams<{
    diaryId: string;
    personId: string;
  }>();
  const [diary, setDiary] = useState<DiaryDetail | null>(null);
  const [patient, setPatient] = useState<PersonRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (diaryId && personId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);

          // Buscar dados do paciente
          const patientData = await PersonService.apiPersonRetrieve(
            Number(personId),
          );
          setPatient(patientData);

          // Buscar o diário específico diretamente
          const diaryData =
            await ProviderService.providerPatientsDiariesRetrieve2(
              diaryId,
              Number(personId),
            );

          if (diaryData) {
            setDiary(diaryData as DiaryDetail);
          } else {
            setError("Diário não encontrado.");
          }
        } catch (err) {
          console.error("Error fetching diary data:", err);
          setError("Não foi possível carregar os dados do diário.");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [diaryId, personId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return "Data inválida";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Hora inválida";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      <div className="p-4">
        <Header title="Visualizar Diário" centered={true} />
      </div>

      <div className="flex-1 px-4 overflow-auto m-4">
        {loading && (
          <p className="text-campos-preenchimento2 text-gray2">Carregando...</p>
        )}

        {error && (
          <p className="text-campos-preenchimento2 text-destructive">{error}</p>
        )}

        {!loading && !error && patient && diary && (
          <div className="space-y-6">
            {/* Informações do Paciente */}
            <div className="bg-offwhite p-4 rounded-lg shadow-md">
              <h2 className="text-topicos2 text-typography mb-3">
                Informações do Paciente
              </h2>
              <div className="space-y-2">
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Nome:
                  </span>{" "}
                  {patient.social_name || "Não informado"}
                </p>
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    ID:
                  </span>{" "}
                  {patient.person_id}
                </p>
              </div>
            </div>

            {/* Informações do Diário */}
            <div className="bg-offwhite p-4 rounded-lg shadow-md">
              <h2 className="text-topicos2 text-typography mb-3">
                Informações do Diário
              </h2>
              <div className="space-y-2">
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Data:
                  </span>{" "}
                  {formatDate(diary.date)}
                </p>
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Escopo:
                  </span>{" "}
                  {diary.scope || "Não especificado"}
                </p>
                <p className="text-campos-preenchimento2 text-typography">
                  <span className="text-topicos2 text-typography-foreground">
                    Total de Entradas:
                  </span>{" "}
                  {diary.entries?.length || 0}
                </p>
              </div>
            </div>

            {/* Entradas do Diário */}
            <div className="space-y-4">
              <h2 className="text-topicos2 text-typography">
                Entradas do Diário
              </h2>

              {(!diary.entries || diary.entries.length === 0) && (
                <div className="bg-offwhite p-4 rounded-lg shadow-md">
                  <p className="text-campos-preenchimento2 text-gray2">
                    Nenhuma entrada encontrada neste diário.
                  </p>
                </div>
              )}

              {diary.entries && diary.entries.length > 0 && (
                <div className="space-y-3">
                  {diary.entries.map((entry, index) => (
                    <div
                      key={entry.id || index}
                      className="bg-offwhite p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-topicos2 text-typography">
                          Entrada {index + 1}
                        </h3>
                        {entry.created_at && (
                          <span className="text-desc-titulo text-gray2">
                            {formatTime(entry.created_at)}
                          </span>
                        )}
                      </div>

                      {entry.text_content && (
                        <div className="mb-3">
                          <p className="text-campos-preenchimento2 text-typography whitespace-pre-wrap">
                            {entry.text_content}
                          </p>
                        </div>
                      )}

                      {entry.scope && (
                        <div className="text-desc-titulo text-gray2">
                          <span className="font-medium">Escopo:</span>{" "}
                          {entry.scope}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
