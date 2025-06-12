import { useEffect, useState } from "react";
import Header from "@/components/ui/header";
import { LinkPersonProviderService } from "@/api/services/LinkPersonProviderService";
import { ApiService } from "@/api/services/ApiService";

export default function UnlinkProfessional() {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [personId, setPersonId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPersonIdAndProviders = async () => {
      try {
        setLoading(true);
        const userEntity = await ApiService.apiUserEntityRetrieve();
        setPersonId(userEntity.person_id);

        const result = await LinkPersonProviderService.personProvidersList();
        setProviders(result);
        setError(null);
      } catch (err) {
        setError("Não foi possível carregar os profissionais vinculados.");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonIdAndProviders();
  }, []);

  const handleUnlink = async (providerId: number) => {
    if (!personId) {
      alert("ID do usuário não encontrado.");
      return;
    }
    const confirmed = window.confirm("Você tem certeza que quer remover este profissional?");
    if (!confirmed) return;

    try {
      await LinkPersonProviderService.personProviderUnlinkCreate(personId, providerId);
      setProviders((prev) => prev.filter((p) => p.provider_id !== providerId));
      alert("Profissional desvinculado com sucesso.");
    } catch (err) {
      alert("Erro ao desvincular profissional.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary font-inter">
      {/* Top content */}
      <div className="px-[24px] pt-[24px]">
        <Header
          title="Desvincular profissional"
          subtitle="Escolha o profissional e toque sobre seu nome para se desvincular."
        />
      </div>
      <div className="flex-1 px-4 overflow-auto m-4">
        {loading && <p>Carregando...</p>}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && providers.length === 0 && (
          <p>Nenhum profissional vinculado encontrado.</p>
        )}
        {!loading && !error && providers.length > 0 && (
          <div className="space-y-4">
            {providers.map((provider) => (
              <div
                key={provider.provider_id}
                className="bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray2 p-4 rounded-xl flex items-center space-x-4 cursor-pointer hover:bg-selection dark:hover:bg-[#2c313a] transition shadow-sm"
                onClick={() => handleUnlink(provider.provider_id)}
                title="Clique para desvincular este profissional"
              >
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-blue-500 to-purple-500">
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                      src={provider.profile_picture || "/default-profile.png"}
                      alt={provider.social_name || provider.full_name || provider.name || "Profissional de Saúde"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Nome:{" "}
                    <span className="font-normal">
                      {provider.social_name || provider.full_name || provider.name}
                    </span>
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white mt-1">
                    CNES:{" "}
                    <span className="font-normal">
                      {provider.professional_registration}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}