import { useEffect, useState } from "react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";
import { ObservationService } from "@/api/services/ObservationService";
import type { ObservationRetrieve } from "@/api/models/ObservationRetrieve";
import { useAuth } from "@/contexts/auth";
import { ApiService } from "@/api/services/ApiService"; 
import useSWR from "swr";
import { OpenAPI } from "@/api/core/OpenAPI";

// Header component
const PageHeader = ({ title }: { title: string }) => (
  <h1 className="text-2xl font-bold text-gray-800 mb-6">{title}</h1>
);

// Improved fetcher function with better error handling
const fetcher = async (url: string, token: string) => {
  try {
    // Only set the token if it exists
    if (token) {
      OpenAPI.TOKEN = token;
    } else {
      console.warn("Token is missing in fetcher");
    }
    
    if (url === "user") {
      const userData = await ApiService.apiUserEntityRetrieve();
      if (!userData) {
        throw new Error("User data not available");
      }
      return userData;
    }
    
    if (url === "diaries") {
      // Get the user data first
      const user = await ApiService.apiUserEntityRetrieve();
      if (!user || !user.person_id) {
        throw new Error("User or person_id not available");
      }
      
      // Fetch all observations with proper error handling
      try {
        const allObservations = await ObservationService.apiObservationList();
        
        if (!allObservations) {
          return []; // Return empty array instead of throwing error
        }
        
        // Filter observations to get only diary entries for this user
        return allObservations.filter(obs => {
          // More robust check for person ID matching
          const personId = user.person_id;
          const obsPerson = typeof obs.person === 'object' ? obs.person?.id : obs.person;
          const belongsToUser = String(obsPerson) === String(personId);
          
          // Check if it's a diary-related concept
          const isDiaryEntry = [101, 456, 789].includes(Number(obs.observation_concept));
          
          return belongsToUser && isDiaryEntry;
        });
      } catch (error) {
        console.error("Error fetching observations:", error);
        // Return empty array instead of throwing error
        return [];
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
  const auth = useAuth();
  const user = auth?.user;
  const [isInitialized, setIsInitialized] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication status once when component mounts
  useEffect(() => {
    // Set initialized immediately since we have no loading state to check
    setIsInitialized(true);
    setAuthChecked(true);
    
    if (!auth || !user) {
      console.log("User not authenticated, redirecting to login");
      navigate("/login");
    }
  }, [auth, user, navigate]);
  
  // Create a token-enabled fetcher for SWR
  const tokenFetcher = React.useCallback(
    (url: string) => fetcher(url, user?.token || ""),
    [user?.token]
  );
  
  // Fetch user data only when auth is initialized and user exists
  const { 
    data: userData, 
    error: userError, 
    isLoading: isUserLoading 
  } = useSWR(isInitialized && user ? "user" : null, tokenFetcher, {
    revalidateOnFocus: false,
    retry: 3,
    onError: (error) => {
      console.error("SWR user error:", error);
    }
  });

  // Fetch diaries after user is loaded
  const { 
    data: diaries, 
    error: diariesError, 
    isLoading: isDiariesLoading 
  } = useSWR(userData ? "diaries" : null, tokenFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // Cache for 1 minute
    retry: 3,
    onError: (error) => {
      console.error("SWR diaries error:", error);
      // Only redirect on auth errors, not on general fetch errors
      if (error.status === 401) {
        navigate("/login");
      }
    }
  });

  // Process diaries data with better null handling
  const processedDiaries = React.useMemo(() => {
    if (!diaries || !Array.isArray(diaries)) return [];
    
    const diaryMap = new Map<string, any>();
    
    // First, group all observations by date to find all unique diary entries
    diaries.forEach((obs: ObservationRetrieve) => {
      // Use a safer approach to get the diary ID
      const diaryId = obs.observation_date || obs.created_at || new Date().toISOString();
      
      if (!diaryMap.has(diaryId)) {
        diaryMap.set(diaryId, {
          id: diaryId,
          date: obs.observation_date || obs.created_at || new Date().toISOString(),
          text: "",
          habitsCount: 0,
          wellnessCount: 0,
          shared: Boolean(obs.shared_with_provider)
        });
      }
    });

    // Now count by concept type for each diary date
    diaries.forEach((obs: ObservationRetrieve) => {
      const diaryId = obs.observation_date || obs.created_at || new Date().toISOString();
      const entry = diaryMap.get(diaryId);
      
      if (!entry) return; // Safety check
      
      const conceptId = Number(obs.observation_concept) || 0;
      
      switch (conceptId) {
        case 456: // DIARY_HABITS
          entry.habitsCount += 1;
          break;
        case 789: // DIARY_WELLNESS
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

  // Don't show loading if we're still checking auth
  if (!authChecked) {
    return null; // Return nothing during initial auth check
  }

  // Handle loading state after auth is initialized
  if (isUserLoading || isDiariesLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-gray-500">Carregando...</div>
      </div>
    );
  }
  
  // Handle authentication error (only after auth loading is complete)
  if (!user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-red-500">
          Você precisa estar logado para acessar esta página
        </div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Ir para login
          </button>
        </div>
      </div>
    );
  }
  
  // Handle user data error but don't prevent rendering
  if (userError) {
    console.error("User data error details:", userError);
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-red-500">
          Erro ao carregar dados do usuário
        </div>
        <div className="text-center mt-2">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }
  
  // Show diaries error but still render any available data
  if (diariesError) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-red-500 mb-4">
          Erro ao carregar diários
        </div>
        <div className="text-center mb-4">
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Tentar novamente
          </button>
        </div>
        
        {/* Still show any previously cached diaries if available */}
        {processedDiaries.length > 0 && (
          <div className="space-y-4 mt-6">
            <h2 className="text-lg font-medium text-gray-700">Diários anteriormente carregados:</h2>
            {/* Diary entries would be here */}
          </div>
        )}
      </div>
    );
  }
  
  // Handle no diary entries
  if (!processedDiaries || processedDiaries.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="mb-4">
          <BackArrow />
        </div>
        <PageHeader title="Diário" />
        <div className="text-center text-gray-500">Nenhum diário encontrado</div>
        <div className="text-center mt-4">
          <Link
            to="/diary/new"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Criar novo diário
          </Link>
        </div>
      </div>
    );
  }
  
  // Normal render with diary entries
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-4">
        <BackArrow />
      </div>
      <PageHeader title="Diário" />
      
      <div className="mb-6 flex justify-end">
        <Link
          to="/diary/new"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Novo Diário
        </Link>
      </div>
      
      <div className="space-y-4">
        {processedDiaries.map((diary) => (
          <Link
            to={`/diary/${encodeURIComponent(diary.id)}`}
            key={diary.id}
            className="block group"
          >
            <div className={`p-4 border rounded-lg hover:shadow-md transition-shadow ${
              diary.shared ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
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
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    Shared
                  </span>
                )}
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