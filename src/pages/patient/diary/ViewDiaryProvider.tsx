import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";

// Mock BackArrow component

// Header component
const PageHeader = ({ title }) => (
  <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
);

// Mock patient data
const MOCK_PATIENTS = {
  "123": {
    id: "123",
    name: "João Silva",
    age: 42,
    gender: "Male"
  },
  "456": {
    id: "456",
    name: "Maria Oliveira",
    age: 35,
    gender: "Female"
  },
  "789": {
    id: "789",
    name: "Carlos Santos",
    age: 28,
    gender: "Male"
  }
};

// Mock diary entries - shared with provider
const MOCK_PATIENT_DIARIES = {
  "123": [
    {
      id: "2025-05-18",
      date: "2025-05-18T09:00:00.000Z",
      text: "Tive dores nas costas durante a noite. Os exercícios de alongamento que o Dr. recomendou ajudaram bastante. A medicação para dor também está funcionando bem.",
      habitsCount: 3,
      wellnessCount: 5,
      shared: true
    },
    {
      id: "2025-05-15",
      date: "2025-05-15T09:00:00.000Z",
      text: "Hoje foi um bom dia. Consegui andar por 20 minutos sem dor. Os exercícios estão fazendo efeito, mas ainda sinto um desconforto quando fico sentado por muito tempo.",
      habitsCount: 4,
      wellnessCount: 5,
      shared: true
    },
    {
      id: "2025-05-10",
      date: "2025-05-10T09:00:00.000Z",
      text: "Dor nas costas piorou. Vou precisar remarcar a consulta para antes do previsto se continuar assim.",
      habitsCount: 2,
      wellnessCount: 3,
      shared: true
    }
  ],
  "456": [
    {
      id: "2025-05-19",
      date: "2025-05-19T09:00:00.000Z", 
      text: "Estou seguindo a dieta recomendada. Meu nível de açúcar no sangue está mais estável agora. Me sinto com mais energia.",
      habitsCount: 5,
      wellnessCount: 4,
      shared: true
    },
    {
      id: "2025-05-12",
      date: "2025-05-12T09:00:00.000Z",
      text: "",
      habitsCount: 3,
      wellnessCount: 4,
      shared: true
    }
  ],
  "789": []  // No shared diaries for this patient
};

export default function ViewPatientDiaries() {
  const navigate = useNavigate();
  // Ensure we have a patientId, with a default for demo purposes
  const { patientId = "123" } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [patient, setPatient] = useState(null);
  const [diaries, setDiaries] = useState([]);
  const [user, setUser] = useState(null);
  
  // Mock data loading and authentication check
  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock successful provider authentication
        setUser({ id: "provider-001", name: "Dr. Ana Costa", is_provider: true });
        
        console.log("Patient ID from URL:", patientId);
        
        // Get mock patient data - handle potentially undefined patientId
        if (patientId) {
          const mockPatient = MOCK_PATIENTS[patientId];
          console.log("Found patient:", mockPatient);
          
          if (mockPatient) {
            setPatient(mockPatient);
            
            // Get mock patient diaries
            const mockDiaries = MOCK_PATIENT_DIARIES[patientId] || [];
            setDiaries(mockDiaries);
          } else {
            console.error(`No mock patient found with ID: ${patientId}`);
            // For demo purposes, default to a patient if ID not found
            setPatient(MOCK_PATIENTS["123"]);
            setDiaries(MOCK_PATIENT_DIARIES["123"] || []);
          }
        } else {
          // Default to the first patient if no ID provided
          setPatient(MOCK_PATIENTS["123"]);
          setDiaries(MOCK_PATIENT_DIARIES["123"] || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [patientId]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }
  
  // Handle authentication error
  if (!user || !user.is_provider) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Acesso não autorizado
        </div>
      </div>
    );
  }
  
  // Handle patient not found
  if (!patient) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Paciente não encontrado
        </div>
      </div>
    );
  }
  
  // Handle no shared diary entries
  if (diaries.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <h2 className="text-xl font-medium text-blue-600 mb-4">
          {patient.name}
        </h2>
        <div className="text-center text-gray-500">Este paciente não compartilhou nenhum diário</div>
      </div>
    );
  }
  
  // Normal render with patient's shared diary entries
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-4">
        <BackArrow />
      </div>
      <PageHeader title="Diário do Paciente" />
      <h2 className="text-xl font-medium text-primary mb-4">
        {patient.name}
      </h2>
      <div className="space-y-4">
        {diaries.map((diary) => (
          <Link
            to={`/patient/${patientId}/diary/${encodeURIComponent(diary.id)}`}
            key={diary.id}
            className="block group"
          >
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow border-offwhite bg-offwhite">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-neutral-700">
                  {new Date(diary.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span>{diary.habitsCount} habits tracked</span>
                <span>{diary.wellnessCount} wellness questions</span>
              </div>
              {diary.text ? (
                <p className="text-gray-600 line-clamp-2">
                  {diary.text}
                </p>
              ) : (
                <p className="text-gray-400 italic">No journal entry</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>  
  );
}


/*
import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";
import { ObservationService } from "@/api/services/ObservationService";
import type { ObservationRetrieve } from "@/api/models/ObservationRetrieve";
import { useAuth } from "@/contexts/auth";
import { ApiService } from "@/api/services/ApiService"; 
import useSWR from "swr";

// Header component - keeping this consistent with your other components
const PageHeader = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
);

// Fetcher function for provider to access patient data and diaries
const fetcher = async (url: string) => {
  try {
    // Parse the URL to extract the resource type and any parameters
    const [resourceType, patientId] = url.split('?');
    
    if (resourceType === "patient" && patientId) {
      try {
        // Fetch specific patient information
        const patientData = await ApiService.apiPersonEntityRetrieve(patientId);
        if (!patientData) {
          console.error("Patient data is null or undefined");
          throw new Error("Patient data not available");
        }
        return patientData;
      } catch (error) {
        console.error(`Error fetching patient data:`, error);
        throw error;
      }
    }
    
    if (resourceType === "patientDiaries" && patientId) {
      try {
        // Fetch observations for the specific patient
        // Note: You might need to adjust this based on your actual API
        const patientObservations = await ObservationService.apiObservationList({
          person: patientId,
          // Only fetch observations shared with provider
          shared_with_provider: true
        });
        
        console.log("Patient observations fetched:", patientObservations?.length || 0);
        
        // Filter to only include diary-related observations
        return patientObservations.filter(obs => {
          // Check if it's a diary-related concept
          const isDiaryEntry = [101, 456, 789].includes(Number(obs.observation_concept));
          
          // Only include observations shared with provider
          const isShared = obs.shared_with_provider === true;
          
          return isDiaryEntry && isShared;
        });
      } catch (error) {
        console.error("Error fetching patient diaries:", error);
        throw error;
      }
    }
    
    throw new Error(`Unknown fetcher URL: ${url}`);
  } catch (error) {
    console.error(`Error in fetcher for URL ${url}:`, error);
    throw error;
  }
};

export default function ViewPatientDiaries() {
  const navigate = useNavigate();
  const { patientId } = useParams<{ patientId: string }>();
  const { user } = useAuth(); // For provider authentication
  
  // Redirect if not authenticated or not a provider
  useEffect(() => {
    if (!user) {
      console.log("User not authenticated, redirecting");
      navigate("/login");
      return;
    }
    
    // Check if user is a provider (adjust based on your auth system)
    if (!user.is_provider) {
      console.log("User is not a provider, redirecting");
      navigate("/unauthorized");
    }
  }, [user, navigate]);
  
  // Fetch patient data
  const { 
    data: patientData, 
    error: patientError, 
    isLoading: isPatientLoading 
  } = useSWR(patientId ? `patient?${patientId}` : null, fetcher, {
    revalidateOnFocus: false,
    onError: (error) => {
      console.error("SWR patient error:", error);
    }
  });

  // Fetch patient's shared diaries after patient data is loaded
  const { 
    data: diaryObservations, 
    error: diariesError, 
    isLoading: isDiariesLoading 
  } = useSWR(patientData ? `patientDiaries?${patientId}` : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
    onError: (error) => {
      console.error("SWR patient diaries error:", error);
    }
  });

  // Process diaries data similar to the user view
  const processedDiaries = React.useMemo(() => {
    if (!diaryObservations) return [];
    
    const diaryMap = new Map<string, any>();
    
    // First, group all observations by date to find all unique diary entries
    diaryObservations.forEach((obs: ObservationRetrieve) => {
      const diaryId = obs.observation_date || obs.created_at;
      
      if (!diaryMap.has(diaryId)) {
        diaryMap.set(diaryId, {
          id: diaryId,
          date: obs.observation_date || obs.created_at,
          text: "",
          habitsCount: 0,
          wellnessCount: 0,
          shared: true // All entries here are already filtered to be shared
        });
      }
    });

    // Now count by concept type for each diary date
    diaryObservations.forEach((obs: ObservationRetrieve) => {
      const diaryId = obs.observation_date || obs.created_at;
      const entry = diaryMap.get(diaryId);
      
      if (!entry) return; // Safety check
      
      switch (Number(obs.observation_concept)) {
        case 456: // DIARY_HABITS
          // Increment habits count
          entry.habitsCount += 1;
          break;
        case 789: // DIARY_WELLNESS
          // Increment wellness count
          entry.wellnessCount += 1;
          break;
        case 101: // DIARY_TEXT
          entry.text = obs.value_as_string || "";
          break;
      }
    });

    return Array.from(diaryMap.values()).sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [diaryObservations]);

  // Handle loading state
  if (isPatientLoading || isDiariesLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }
  
  // Handle authentication error or redirect
  if (!user || !user.is_provider) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Acesso não autorizado
        </div>
      </div>
    );
  }
  
  // Handle patient data error
  if (patientError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Erro ao carregar dados do paciente
        </div>
      </div>
    );
  }
  
  // Handle diaries error
  if (diariesError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Erro ao carregar diários do paciente
        </div>
      </div>
    );
  }
  
  // Handle no patient found
  if (!patientData) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <div className="text-center text-red-500">
          Paciente não encontrado
        </div>
      </div>
    );
  }
  
  // Handle no shared diary entries
  if (processedDiaries.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário do Paciente" />
        <h2 className="text-xl font-medium text-primary mb-4">
          {patientData.name || `Paciente ${patientId}`}
        </h2>
        <div className="text-center text-gray-500">Este paciente não compartilhou nenhum diário</div>
      </div>
    );
  }
  
  // Normal render with patient's shared diary entries
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-4">
        <BackArrow />
      </div>
      <PageHeader title="Diário do Paciente" />
      <h2 className="text-xl font-medium text-primary mb-4">
        {patientData.name || `Paciente ${patientId}`}
      </h2>
      <div className="space-y-4">
        {processedDiaries.map((diary) => (
          <Link
            to={`/patient/${patientId}/diary/${encodeURIComponent(diary.id)}`}
            key={diary.id}
            className="block group"
          >
            <div className="p-4 border rounded-lg hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-neutral-700">
                  {new Date(diary.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h3>
              </div>
              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span>{diary.habitsCount} habits tracked</span>
                <span>{diary.wellnessCount} wellness questions</span>
              </div>
              {diary.text ? (
                <p className="text-gray-600 line-clamp-2">
                  {diary.text}
                </p>
              ) : (
                <p className="text-gray-400 italic">No journal entry</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>  
  );
}

*/