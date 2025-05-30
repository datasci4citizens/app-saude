import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/ui/header';
import { useNavigate } from 'react-router-dom';
import { PersonService } from '@/api/services/PersonService';
import { ProviderService } from '@/api/services/ProviderService'; // Import ProviderService
import type { PersonRetrieve } from '@/api/models/PersonRetrieve';
import ViewButton from '@/components/ui/ViewButton'; // Import ViewButton
import BottomNavigationBar from "@/components/ui/navigator-bar";

// Define a basic interface for Diary Entries
interface DiaryEntry {
  id: string | number;
  created_at: string; // Assuming a date string
  title?: string;
  text_content: string;
  // Add other fields if known, e.g., type: 'diary' | 'help_request'
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

  const calculateAge = (birthDateString?: string | null): string => {
    if (!birthDateString) return "idade não informada";
    try {
      const birthDate = new Date(birthDateString);
      if (isNaN(birthDate.getTime())) return "idade inválida";
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${age} anos`;
    } catch (e) {
      console.error("Error calculating age:", e);
      return "erro no cálculo da idade";
    }
  };

  useEffect(() => {
    if (id) {
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

      const fetchDiaries = async () => {
        try {
          setDiariesLoading(true);
          const diariesData = await ProviderService.providerPatientsDiariesRetrieve(Number(id));
          setDiaries(diariesData as DiaryEntry[]); 
          setDiariesError(null);
        } catch (err) {
          console.error("Error fetching diaries:", err);
          setDiariesError("Não foi possível carregar os diários do paciente.");
        } finally {
          setDiariesLoading(false);
        }
      };
      fetchDiaries();
    }
  }, [id]);

  const headerTitle = "Histórico";
  const headerSubtitle = patient?.social_name
    ? `${context === 'emergency' ? 'Emergência: ' : ''}${patient.social_name} - ${calculateAge(patient.birth_datetime)}`
    : context === 'emergency'
      ? `Detalhes da Emergência Paciente: ${id}`
      : `Detalhes do Paciente: ${id}`;
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `Dia ${date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`;
    } catch (e) {
      return "Data inválida";
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary pb-24">
      <div className="p-4">
        <Header
          title={headerTitle}
          subtitle={headerSubtitle}
          subtitleClassName="text-selection text-titulowindow font-inter" // Use text-titulowindow and remove font-bold
          onBackClick={() => navigate(-1)} 
        />
      </div>
      <div className="flex-1 px-4 overflow-auto">
        <div className="bg-offwhite p-6 rounded-lg shadow-md">
          <h2 className="text-titulo mb-4 text-typography"> {/* Use text-titulo and remove font-semibold */} 
            Informações do Paciente
          </h2>
          {loading && <p className="text-campos-preenchimento2 text-gray2">Carregando...</p>} {/* Use text-campos-preenchimento2 */}
          {error && <p className="text-campos-preenchimento2 text-destructive">{error}</p>} {/* Use text-campos-preenchimento2 */}
          {patient && !loading && !error && (
            <div className="space-y-3">
              <p className="text-campos-preenchimento2 text-typography">
                <span className="text-topicos2 text-typography-foreground">ID do Paciente:</span> {patient.person_id} {/* Use text-topicos2 for span */}
              </p>
              <p className="text-campos-preenchimento2 text-typography">
                <span className="text-topicos2 text-typography-foreground">Nome:</span> {patient.social_name || "Não informado"} {/* Use text-topicos2 for span */}
              </p>
              {context === 'emergency' && (
                <p className="text-topicos text-destructive">
                  Contexto: Emergência {/* Use text-topicos and remove font-semibold */}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Seção de Diários */}
        <div className="mt-6 bg-offwhite p-6 rounded-lg shadow-md">
          <h2 className="text-titulo mb-4 text-typography">
            Diários do Paciente {/* Use text-titulo and remove font-semibold */}
          </h2>
          {diariesLoading && <p className="text-campos-preenchimento2 text-gray2">Carregando diários...</p>} {/* Use text-campos-preenchimento2 */}
          {diariesError && <p className="text-campos-preenchimento2 text-destructive">{diariesError}</p>} {/* Use text-campos-preenchimento2 */}
          {!diariesLoading && !diariesError && diaries.length === 0 && (
            <p className="text-campos-preenchimento2 text-gray2">Nenhum diário encontrado para este paciente.</p> // Use text-campos-preenchimento2
          )}
          {!diariesLoading && !diariesError && diaries.length > 0 && (
            <div className="space-y-4">
              {diaries.map((diary) => (
                <ViewButton
                  key={diary.id}
                  dateText={formatDate(diary.created_at)}
                  mainText={diary.title || "Diário"}
                  subText={diary.text_content.substring(0, 100) + (diary.text_content.length > 100 ? '...' : '')}
                  onClick={() => {
                    console.log("Clicked diary:", diary.id);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
