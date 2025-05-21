import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";



// Header component - keeping this consistent with your other components
const PageHeader = ({ title }) => (
  <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
);

// Mock diary data
const MOCK_DIARIES = [
  {
    id: "2025-05-20",
    date: "2025-05-20T09:00:00.000Z",
    text: "Today was a productive day. I managed to complete the React component for the diary view. I'm feeling good about the progress I'm making on this project.",
    habitsCount: 3,
    wellnessCount: 5,
    shared: true
  },
  {
    id: "2025-05-19",
    date: "2025-05-19T09:00:00.000Z",
    text: "Struggled a bit with the API integration today. Need to revisit the authentication flow tomorrow. Made some progress on the UI design though.",
    habitsCount: 2,
    wellnessCount: 4,
    shared: false
  },
  {
    id: "2025-05-18",
    date: "2025-05-18T09:00:00.000Z",
    text: "Had a great brainstorming session with the team. We decided on the core features for the MVP. I'm excited to start implementing them.",
    habitsCount: 4,
    wellnessCount: 5,
    shared: true
  },
  {
    id: "2025-05-17",
    date: "2025-05-17T09:00:00.000Z",
    text: "",
    habitsCount: 1,
    wellnessCount: 3,
    shared: false
  },
  {
    id: "2025-05-16",
    date: "2025-05-16T09:00:00.000Z",
    text: "Feeling a bit under the weather today. Took it easy and focused on documentation rather than coding. Should be back to full productivity tomorrow.",
    habitsCount: 0,
    wellnessCount: 2,
    shared: false
  }
];

export default function ViewDiaryUser() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [diaries, setDiaries] = useState([]);
  const [user, setUser] = useState(null);
  
  // Mock authentication check and data loading
  useEffect(() => {
    // Simulate loading delay
    const loadData = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock successful authentication
        setUser({ id: 1, name: "Test User", person_id: 123 });
        
        // Set mock diary data
        setDiaries(MOCK_DIARIES);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [navigate]);

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <PageHeader title="Diário" />
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }
  
  // Handle authentication error or redirect
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <PageHeader title="Diário" />
        <div className="text-center text-red-500">
          Você precisa estar logado para acessar esta página
        </div>
      </div>
    );
  }
  
  // Handle no diary entries
  if (diaries.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-gray-500">Nenhum diário encontrado</div>
      </div>
    );
  }
  
  // Normal render with diary entries
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-4">
        <BackArrow />
      </div>
      <PageHeader title="Histórico Diário" />
      <div className="space-y-4">
        {diaries.map((diary) => (
          <Link
            to={`/diary/${encodeURIComponent(diary.id)}`}
            key={diary.id}
            className="block group"
          >
            <div className={`p-4 border rounded-lg  border-offwhite-200 bg-offwhite hover:shadow-md transition-shadow ${
              diary.shared ? 'border-offwhite-200 bg-offwhite-50' : 'border-offwhite-200 bg-offwhite'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg text-neutral-700">
                  {new Date(diary.date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>
                {diary.shared && (
                  <span className="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                    Compartilhado
                  </span>
                )}
              </div>
              <div className="flex gap-4 text-sm text-gray-500 mb-3">
                <span>{diary.habitsCount} hábitos</span>
                <span>{diary.wellnessCount} bem estar</span>
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
ORIGINAL CODE COMMENTED OUT FOR REFERENCE
------------------------------------------------------

import React from "react";
import { Link, useNavigate } from "react-router-dom";
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

// Better structured fetcher function with improved error handling
const fetcher = async (url: string) => {
  try {
    if (url === "user") {
      const userData = await ApiService.apiUserEntityRetrieve();
      if (!userData) {
        console.error("User data is null or undefined");
        throw new Error("User data not available");
      }
      return userData;
    }
    
    if (url === "diaries") {
      try {
        // Get the user data first
        const user = await ApiService.apiUserEntityRetrieve();
        if (!user) {
          console.error("User not available when fetching diaries");
          throw new Error("User not available");
        }
        
        const allObservations = await ObservationService.apiObservationList();
        console.log("Observations fetched:", allObservations?.length || 0);
        
        return allObservations.filter(obs => {
          // Check if observation belongs to current user
          const belongsToUser = obs.person === user.person_id || String(obs.person) === String(user.person_id);
          
          // Check if it's a diary-related concept (based on your processedDiaries function)
          const isDiaryEntry = [101, 456, 789].includes(Number(obs.observation_concept));
          
          return belongsToUser && isDiaryEntry;
        });
      } catch (error) {
        console.error("Error fetching diaries:", error);
        throw error;
      }
    }
    throw new Error(`Unknown fetcher URL: ${url}`);
  } catch (error) {
    console.error(`Error in fetcher for URL ${url}:`, error);
    throw error;
  }
};

export default function ViewDiaryUser() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Match the actual return value of your useAuth hook
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      console.log("User not authenticated, redirecting");
      navigate("/login");
    }
  }, [user, navigate]);
  
  // Fetch user data with proper SWR configuration
  const { 
    data: userData, 
    error: userError, 
    isLoading: isUserLoading 
  } = useSWR(user ? "user" : null, fetcher, {
    revalidateOnFocus: false,
    onError: (error) => {
      console.error("SWR user error:", error);
    }
  });

  // Fetch diaries after user is loaded, with proper dependency chaining
  const { 
    data: diaries, 
    error: diariesError, 
    isLoading: isDiariesLoading 
  } = useSWR(userData ? "diaries" : null, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
    onError: (error) => {
      console.error("SWR diaries error:", error);
    }
  });

  // Process diaries data
  const processedDiaries = React.useMemo(() => {
    if (!diaries) return [];
    
    const diaryMap = new Map<string, any>();
    
    // First, group all observations by date to find all unique diary entries
    diaries.forEach((obs: ObservationRetrieve) => {
      const diaryId = obs.observation_date || obs.created_at;
      
      if (!diaryMap.has(diaryId)) {
        diaryMap.set(diaryId, {
          id: diaryId,
          date: obs.observation_date || obs.created_at,
          text: "",
          habitsCount: 0,
          wellnessCount: 0,
          shared: obs.shared_with_provider || false
        });
      }
    });

    // Now count by concept type for each diary date
    diaries.forEach((obs: ObservationRetrieve) => {
      const diaryId = obs.observation_date || obs.created_at;
      const entry = diaryMap.get(diaryId);
      
      if (!entry) return; // Safety check
      
      switch (Number(obs.observation_concept)) {
        case 456: // DIARY_HABITS
          // Increment habits count - just count one per observation of this type
          entry.habitsCount += 1;
          break;
        case 789: // DIARY_WELLNESS
          // Increment wellness count - just count one per observation of this type
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
  }, [diaries]);

  // UI rendering and other logic follows...
*/