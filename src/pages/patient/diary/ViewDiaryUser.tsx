import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BackArrow from "@/components/ui/back_arrow";
import { DiariesService } from "@/api/services/DiariesService";
import type { CancelablePromise } from "@/api/core/CancelablePromise";

// Add TypeScript interfaces for the diary data
interface DiaryListEntry {
  id: string;
  created_at: string;
  habits?: Array<{ id: string }>;
  wellness?: Array<{ id: string }>;
  text?: string;
}

export default function ViewDiaryUser() {
  const [diaries, setDiaries] = useState<DiaryListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let promise: CancelablePromise<any>;
    
    const fetchDiaries = async () => {
      try {
        promise = DiariesService.diariesRetrieve();
        const data = await promise;
        
        // Map the response data to DiaryListEntry format
        const formattedDiaries: DiaryListEntry[] = data.map((entry: any) => ({
          id: entry.id,
          created_at: entry.created_at,
          habits: entry.habits || [],
          wellness: entry.wellness || [],
          text: entry.text
        }));
        
        setDiaries(formattedDiaries);
        setError(null);
      } catch (err) {
        console.error("Error fetching diaries:", err);
        setError("Failed to load diaries. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiaries();

    return () => {
      // Cancel the request if component unmounts
      if (promise) promise.cancel();
    };
  }, []);

  // Rest of the component remains the same as before
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="mb-4">
        <BackArrow />
      </div>
      <h1 className="font-bold text-3xl md:text-4xl text-neutral-800 mb-6">
        Diário
      </h1>

      {isLoading ? (
        <div className="text-center text-gray-500">Carregando diários...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : diaries.length === 0 ? (
        <div className="text-center text-gray-500">Nenhum diário encontrado</div>
      ) : (
        <div className="space-y-4">
          {diaries.map((diary) => (
            <Link
              to={`/diary/${diary.id}`}
              key={diary.id}
              className="block group"
            >
              <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-white">
                {/* Date Header */}
                <h2 className="font-semibold text-lg text-neutral-700 mb-2">
                  {new Date(diary.created_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </h2>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-500 mb-3">
                  <span>
                    {(diary.habits?.length || 0)} hábito(s) registrado(s)
                  </span>
                  <span>
                    {(diary.wellness?.length || 0)} pergunta(s) de bem estar
                  </span>
                </div>

                {/* Text Preview */}
                {diary.text ? (
                  <p className="text-gray-600 line-clamp-2">
                    {diary.text}
                  </p>
                ) : (
                  <p className="text-gray-400 italic">Sem texto registrado</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}