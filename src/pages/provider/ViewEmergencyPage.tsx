import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/ui/header";
import BottomNavigationBar from "@/components/ui/navigator-bar";
import { ErrorMessage } from "@/components/ui/error-message";
import { ProviderService } from "@/api/services/ProviderService";
import type { DiaryRetrieve } from "@/api/models/DiaryRetrieve";

export default function ViewEmergencyPage() {
  const { diaryId, personId } = useParams<{
    diaryId: string;
    personId: string;
  }>();
  const navigate = useNavigate();
  const [diary, setDiary] = useState<DiaryRetrieve | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (diaryId && personId) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          const diaryData =
            await ProviderService.providerPatientsDiariesRetrieve(
              diaryId,
              Number(personId),
            );
          setDiary(diaryData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!diary) {
    return (
      <div className="p-4">
        <ErrorMessage message="Dados do diário não encontrados." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Pedido de Ajuda" showBackButton />

      <main className="flex-grow p-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800">{diary.scope}</h2>
          <p className="text-sm text-gray-400 mt-4">
            {new Date(diary.date).toLocaleString("pt-BR")}
          </p>
        </div>
      </main>

      <BottomNavigationBar
        variant="acs"
        forceActiveId="emergency"
        onItemClick={handleNavigationClick}
      />
    </div>
  );
}
