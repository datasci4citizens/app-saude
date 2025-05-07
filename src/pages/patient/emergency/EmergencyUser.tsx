// EmergencyScreen.tsx
// src/pages/patient/emergency/EmergencyUser.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioCheckbox } from "@/components/forms/radio-checkbox";
import { Button } from "@/components/forms/button";
import { TextField } from '@/components/ui/text_input_diary';
import { ProviderService } from '@/api/services/ProviderService';
import type { Provider } from '@/api/models/Provider';
import { ObservationService } from '@/api/services/ObservationService';
import BackArrow from '@/components/ui/back_arrow';

// Dados mockados temporários
const MOCK_USER = {
  person_id: 999, // ID fixo para desenvolvimento
  token: 'fake-token' // Token mockado
};

export default function EmergencyScreen() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<number[]>([]);
  const [freeText, setFreeText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar profissionais (mockado)
  useEffect(() => {
    const loadProviders = async () => {
      try {
        // Versão mockada
        const mockProviders = [
          { provider_id: 1, social_name: 'Dr. Teste Silva' },
          { provider_id: 2, social_name: 'Enf. Teste Souza' }
        ];
        setProviders(mockProviders);

        // Se quiser usar a API real (ajuste a URL):
        // const providers = await ProviderService.apiProviderList();
        // setProviders(providers);
      } catch (error) {
        console.error('Erro ao carregar profissionais:', error);
      }
    };

    loadProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Dados fixos para desenvolvimento
      const observationData = {
        observation_concept: 456, // ID mockado
        person: MOCK_USER.person_id,
        provider: selectedProviders[0], // Primeiro selecionado
        value_as_string: freeText,
        observation_date: new Date().toISOString(),
        shared_with_provider: true
      };

      // Simular chamada à API
      console.log('Dados enviados:', observationData);
      
      // Se quiser usar a API real:
      // await ObservationService.apiObservationCreate(observationData);

      alert('Alerta enviado com sucesso! (Modo de desenvolvimento)');
      navigate('/');
    } catch (error) {
      console.error('Erro simulado:', error);
      alert('Erro simulado - consulte o console');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProviderSelect = (providerId: number) => {
    setSelectedProviders(prev => 
      prev.includes(providerId)
        ? prev.filter(id => id !== providerId)
        : [...prev, providerId]
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="mb-6">
        <BackArrow />
      </div>

      <h1 className="font-bold text-[28px] ml-8" style={{ fontFamily: "'Work Sans', sans-serif", color: '#3F414E' }}>
        Emergência
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 ml-8">
          <h3 className="font-semibold text-[16px] font-inter text-[#3F414E]">
            Quais profissionais você deseja alertar?
          </h3>
          <div className="flex flex-col gap-4">
            {providers.map(provider => (
              <RadioCheckbox
                key={provider.provider_id}
                id={`provider-${provider.provider_id}`}
                label={provider.social_name || 'Profissional sem nome'}
                checked={selectedProviders.includes(provider.provider_id)}
                onCheckedChange={() => handleProviderSelect(provider.provider_id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-2 ml-8">
          <TextField
            size="large"
            multiline
            variant="static-orange"
            label="Mensagem"
            placeholder="Descreva sua emergência..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
          />
        </div>

        <div className="px-8">
          <Button 
            variant="orange" 
            size="responsive"
            type="submit"
            disabled={isSubmitting || !selectedProviders.length}
          >
            {isSubmitting ? 'Enviando...' : 'ENVIAR ALERTA'}
          </Button>
        </div>
      </form>
    </div>
  );
}