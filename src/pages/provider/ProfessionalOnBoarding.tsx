import { useState } from 'react';
import { ProfessionalInfoForm } from '@/pages/provider/ProfessionalInfoForm';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/ui/header';
import useSWRMutation from 'swr/mutation';
import type { FullProviderCreate } from '@/api/models/FullProviderCreate';
import { ApiService, type ProviderCreate } from '@/api';
import { FullProviderService } from '@/api/services/FullProviderService';
import { SuccessMessage } from '@/components/ui/success-message';
import { ErrorMessage } from '@/components/ui/error-message';

// Define the provider data type with proper backend field naming (snake_case)
interface ProviderData {
  social_name?: string | null;
  birth_datetime?: string | null;
  professional_registration?: number | null;
  specialty_concept?: number | null;
  care_site?: number | null;
  document?: File | null;
}

export default function ProfessionalOnboarding() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup SWR mutation
  const { trigger, isMutating } = useSWRMutation(
    'fullProviderOnboarding',
    async (_key, { arg }: { arg: ProviderCreate }) => {
      const fullData: FullProviderCreate = {
        provider: arg,
      };
      console.log('Submitting full provider data:', fullData);
      return FullProviderService.apiFullProviderCreate(fullData);
    },
  );

  const clearError = () => {
    setError(null);
  };

  // Handle form submission
  const handleFormSubmit = async (data: ProviderData) => {
    console.log('Professional data submitted:', data);

    // Clear previous states
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    // Function to fetch user entity and show success
    const fetchUserEntity = async () => {
      try {
        const result = await ApiService.apiUserEntityRetrieve();
        console.log('User entity result:', result);

        if (result.person_id) {
          setSuccess(`Cadastro realizado com sucesso! Seu Person ID é: ${result.person_id}`);
        } else if (result.provider_id) {
          setSuccess(`Cadastro realizado com sucesso! Seu Provider ID é: ${result.provider_id}`);
        } else {
          setSuccess('Cadastro realizado com sucesso!');
        }

        // Wait to show success message, then navigate
        await new Promise((resolve) => setTimeout(resolve, 3000));
        navigate('/acs-main-page');
      } catch (err) {
        console.error('Erro ao buscar entidade do usuário:', err);
        setError('Erro ao buscar informações do usuário após o cadastro.');
      }
    };

    try {
      // Create provider data
      const providerData: ProviderCreate = {
        social_name: data.social_name,
        birth_datetime: data.birth_datetime,
        professional_registration: data.professional_registration ?? undefined,
        specialty_concept: data.specialty_concept,
        care_site: null,
        profile_picture: localStorage.getItem('profileImage') || '',
      };

      // Pass the data directly to trigger
      const result = await trigger(providerData);
      console.log('Submission result:', result);
      await fetchUserEntity();
    } catch (err) {
      console.error('Registration error:', err);
      setError('Erro ao realizar cadastro profissional. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button click
  const handleBackClick = (): void => {
    navigate('/welcome'); // Go back to previous page
  };

  return (
    <div className="h-full bg-homebg overflow-y-auto" style={{ height: '100vh' }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="px-8 pt-9">
          <Header title="Preencha informações profissionais" onBackClick={handleBackClick} />
        </div>

        <div className="pl-9 pr-9">
          {/* Success Message */}
          {success && <SuccessMessage message={success} className="mb-4" />}

          {/* Error Message */}
          {error && (
            <ErrorMessage
              message={error}
              onClose={clearError}
              onRetry={clearError}
              variant="destructive"
              className="mb-4"
            />
          )}

          {/* Loading State */}
          {!success &&
            (isMutating || isSubmitting ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-selected mb-4" />
                <p className="text-typography text-sm text-center">
                  Processando dados profissionais...
                </p>
              </div>
            ) : (
              <ProfessionalInfoForm onSubmit={handleFormSubmit} />
            ))}

          {/* Show success state with option to navigate manually */}
          {success && (
            <div className="text-center mt-6">
              <p className="text-typography text-sm mb-4">
                Redirecionando para a página principal...
              </p>
              <button
                onClick={() => navigate('/acs-main-page')}
                className="px-6 py-2 bg-selected hover:bg-selected/80 rounded-full text-accent2 font-medium transition-colors"
              >
                Ir para página principal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
