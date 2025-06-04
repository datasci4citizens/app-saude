import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/ui/header";
import { Button } from "@/components/forms/button";
import { DiariesService } from "@/api/services/DiariesService";
import { ChevronRight, PlusCircle } from "lucide-react";

// Updated interface to match actual data structure
interface DiaryEntry {
  id: string;
  created_at: string; // Use created_at for diary submission date
  text?: string;
  text_shared?: boolean;
  interest_areas?: Array<{
    interest_area_id: number;
    shared_with_provider: boolean;
    triggers?: Array<{
      trigger_id: number;
      value_as_string: string;
    }>;
  }>;
}

export default function DiaryListPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      try {
        setIsLoading(true);
        const response = await DiariesService.diariesRetrieve();
        console.log("API response:", response);
        setDiaries(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error fetching diaries:", error);
        // Set empty array on error
        setDiaries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();
  }, []);

  const handleCreateDiary = () => {
    navigate('/diary/new');
  };

  const handleViewDiary = (id: string) => {
    navigate(`/diary/${id}`);
  };

  // Group diaries by date for display
  const groupedDiaries: Record<string, DiaryEntry[]> = {};
  
  diaries.forEach(diary => {
    const dateObj = new Date(diary.created_at);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dateKey = `${day}/${month}`;
    
    if (!groupedDiaries[dateKey]) {
      groupedDiaries[dateKey] = [];
    }
    
    groupedDiaries[dateKey].push(diary);
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4 bg-primary min-h-screen pb-24">
      <Header 
        title="Diário"
        onBackClick={() => navigate("/user-main-page")}
      />
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Carregando diários...</p>
        </div>
      ) : Object.keys(groupedDiaries).length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-center text-typography/70 mb-4">
            Você ainda não possui diários.
          </p>
          <Button 
            onClick={handleCreateDiary}
            className="bg-secondary text-grey2 flex items-center gap-2"
          >
            <PlusCircle size={16} />
            Criar Diário
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {Object.entries(groupedDiaries).map(([date, entries]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-medium text-sm">Dia {date}</h3>
              
              {entries.map(entry => (
                <div 
                  key={entry.id} 
                  className="bg-card rounded-lg p-4 shadow-sm"
                  onClick={() => handleViewDiary(entry.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-sm">
                      {entry.interest_areas && entry.interest_areas.length > 0 
                        ? "Interesses" 
                        : "Diário"}
                    </h4>
                    <ChevronRight size={16} className="text-gray2" />
                  </div>
                  
                  {entry.text && (
                    <p className="text-sm text-typography/80 line-clamp-2">
                      {entry.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-0 left-0 flex justify-center">
        <Button 
          onClick={handleCreateDiary}
          className="rounded-full h-14 w-14 flex items-center justify-center bg-accent hover:bg-accent/90"
        >
          <PlusCircle size={24} className="text-selection" />
        </Button>
      </div>
    </div>
  );
}